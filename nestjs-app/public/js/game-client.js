/**
 * Game Client - Handles communication between terminal interface and backend
 */

class GameClient {
    constructor() {
        this.baseUrl = '/api';
        this.gameState = null;
        this.currentGameId = null;
        this.wsConnection = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    // Initialize connection to backend
    async initialize() {
        try {
            // Check if we have an existing game session
            const savedGameId = localStorage.getItem('questweaverGameId');
            if (savedGameId) {
                await this.loadGame(savedGameId);
            } else {
                await this.createNewGame();
            }
            
            this.setupWebSocketConnection();
            return { success: true };
        } catch (error) {
            console.error('Failed to initialize game client:', error);
            return { success: false, error: error.message };
        }
    }

    // Create a new game session
    async createNewGame() {
        try {
            const response = await fetch(`${this.baseUrl}/game/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create game: ${response.statusText}`);
            }
            
            const gameData = await response.json();
            this.currentGameId = gameData.gameId;
            this.gameState = gameData.gameState;
            
            // Save game ID to localStorage
            localStorage.setItem('questweaverGameId', this.currentGameId);
            
            return gameData;
        } catch (error) {
            console.error('Error creating new game:', error);
            throw error;
        }
    }

    // Load existing game
    async loadGame(gameId) {
        try {
            const response = await fetch(`${this.baseUrl}/game/${gameId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    // Game not found, create new one
                    return await this.createNewGame();
                }
                throw new Error(`Failed to load game: ${response.statusText}`);
            }
            
            const gameData = await response.json();
            this.currentGameId = gameId;
            this.gameState = gameData.gameState;
            
            return gameData;
        } catch (error) {
            console.error('Error loading game:', error);
            throw error;
        }
    }

    // Process a game command
    async processCommand(command) {
        if (!this.currentGameId) {
            return {
                success: false,
                message: 'No active game session'
            };
        }

        try {
            const response = await fetch(`${this.baseUrl}/game/${this.currentGameId}/command`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command })
            });

            if (!response.ok) {
                throw new Error(`Command failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            // Update local game state
            if (result.gameState) {
                this.gameState = result.gameState;
            }

            return result;
        } catch (error) {
            console.error('Error processing command:', error);
            return {
                success: false,
                type: 'error',
                message: `Network error: ${error.message}`
            };
        }
    }

    // Save game state
    async saveGame(slotName = 'quicksave') {
        if (!this.currentGameId) {
            return { success: false, message: 'No active game session' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/game/${this.currentGameId}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotName })
            });

            if (!response.ok) {
                throw new Error(`Save failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving game:', error);
            return {
                success: false,
                message: `Save failed: ${error.message}`
            };
        }
    }

    // Load saved game state
    async loadSavedGame(slotName = 'quicksave') {
        if (!this.currentGameId) {
            return { success: false, message: 'No active game session' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/game/${this.currentGameId}/load`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotName })
            });

            if (!response.ok) {
                throw new Error(`Load failed: ${response.statusText}`);
            }

            const result = await response.json();
            if (result.gameState) {
                this.gameState = result.gameState;
            }

            return result;
        } catch (error) {
            console.error('Error loading saved game:', error);
            return {
                success: false,
                message: `Load failed: ${error.message}`
            };
        }
    }

    // Get player inventory
    async getInventory() {
        if (!this.currentGameId) {
            return { success: false, message: 'No active game session' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/game/${this.currentGameId}/inventory`);
            
            if (!response.ok) {
                throw new Error(`Failed to get inventory: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting inventory:', error);
            return {
                success: false,
                message: `Failed to get inventory: ${error.message}`
            };
        }
    }

    // Get current room map
    async getMap() {
        if (!this.currentGameId) {
            return { success: false, message: 'No active game session' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/game/${this.currentGameId}/map`);
            
            if (!response.ok) {
                throw new Error(`Failed to get map: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting map:', error);
            return {
                success: false,
                message: `Failed to get map: ${error.message}`
            };
        }
    }

    // Setup WebSocket connection for real-time events
    setupWebSocketConnection() {
        if (!this.currentGameId) return;

        try {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${wsProtocol}//${window.location.host}/ws/game/${this.currentGameId}`;
            
            this.wsConnection = new WebSocket(wsUrl);

            this.wsConnection.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
            };

            this.wsConnection.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.wsConnection.onclose = () => {
                console.log('WebSocket connection closed');
                this.attemptReconnect();
            };

            this.wsConnection.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

        } catch (error) {
            console.error('Failed to setup WebSocket connection:', error);
        }
    }

    // Handle incoming WebSocket messages
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'npc_action':
                // Handle NPC actions like dialogue, movement, combat
                if (window.terminal) {
                    window.terminal.displayNPCAction(data);
                }
                break;
                
            case 'environmental_event':
                // Handle environmental events like explosions, sounds
                if (window.terminal) {
                    window.terminal.displayEnvironmentalEvent(data);
                }
                break;
                
            case 'game_state_update':
                // Update local game state
                this.gameState = data.gameState;
                if (window.terminal) {
                    window.terminal.updateGameState(data.gameState);
                }
                break;
                
            case 'player_update':
                // Update player status
                if (window.terminal && data.playerStatus) {
                    window.terminal.updatePlayerStatus(data.playerStatus);
                }
                break;
                
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    }

    // Attempt to reconnect WebSocket
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.setupWebSocketConnection();
            }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    // Get game state
    getGameState() {
        return this.gameState;
    }

    // Clean up resources
    disconnect() {
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    }
}

// Export for global access
window.GameClient = GameClient;