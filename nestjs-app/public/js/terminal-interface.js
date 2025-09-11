/**
 * Quest Weaver Terminal Interface
 * 80s Hacker Terminal Style Game Interface
 */

class TerminalInterface {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentLocation = 'NOWHERE';
        this.playerName = 'ANONYMOUS';
        this.gameState = 'INITIALIZING';
        this.suggestedCommands = [];
        this.gameClient = null;
        
        this.initializeInterface();
        this.bindEvents();
        this.startBootSequence();
    }

    initializeInterface() {
        // Get references to key elements
        this.elements = {
            terminalDisplay: document.getElementById('terminalDisplay'),
            bootSequence: document.getElementById('bootSequence'),
            gameContent: document.getElementById('gameContent'),
            narrativeSection: document.getElementById('narrativeSection'),
            actionFeedback: document.getElementById('actionFeedback'),
            npcDialogue: document.getElementById('npcDialogue'),
            commandHistory: document.getElementById('commandHistory'),
            commandInput: document.getElementById('commandInput'),
            inputSuggestions: document.getElementById('inputSuggestions'),
            inventoryPanel: document.getElementById('inventoryPanel'),
            mapPanel: document.getElementById('mapPanel'),
            helpPanel: document.getElementById('helpPanel'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            
            // Status bar elements
            gameStatus: document.getElementById('gameStatus'),
            playerName: document.getElementById('playerName'),
            currentLocation: document.getElementById('currentLocation'),
            playerHealth: document.getElementById('playerHealth'),
            playerLevel: document.getElementById('playerLevel'),
            promptLocation: document.getElementById('promptLocation'),
            systemTime: document.getElementById('systemTime')
        };

        // Initialize system time
        this.updateSystemTime();
        setInterval(() => this.updateSystemTime(), 1000);

        // Set up command suggestions
        this.initializeCommandSuggestions();
    }

    bindEvents() {
        // Command input handling
        this.elements.commandInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.elements.commandInput.addEventListener('input', (e) => this.handleInput(e));
        this.elements.commandInput.addEventListener('focus', () => this.hideSuggestions());

        // Click handlers for suggestions
        this.elements.inputSuggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                this.selectSuggestion(e.target.textContent);
            }
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close panels/help
            if (e.key === 'Escape') {
                this.closeAllPanels();
            }
            
            // Focus command input if not already focused
            if (e.key.length === 1 && document.activeElement !== this.elements.commandInput) {
                this.elements.commandInput.focus();
            }
        });

        // Prevent right-click context menu for authentic terminal feel
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    async startBootSequence() {
        // Initialize game client while boot sequence is running
        this.gameClient = new GameClient();
        
        setTimeout(async () => {
            this.elements.bootSequence.style.display = 'none';
            this.elements.gameContent.style.display = 'block';
            
            // Initialize connection to backend
            const initResult = await this.gameClient.initialize();
            
            if (initResult.success) {
                this.updateGameStatus('READY');
                this.displayWelcomeMessage();
                
                // Update player status from game state
                const gameState = this.gameClient.getGameState();
                if (gameState && gameState.player) {
                    this.updatePlayerFromGameState(gameState);
                }
            } else {
                this.updateGameStatus('OFFLINE');
                this.displayError('Failed to connect to game server. Running in offline mode.');
                this.displayWelcomeMessage();
            }
            
            this.elements.commandInput.focus();
        }, 4000);
    }

    updateSystemTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        this.elements.systemTime.textContent = timeString;
    }

    initializeCommandSuggestions() {
        this.suggestedCommands = [
            // Movement commands
            'north', 'south', 'east', 'west', 'up', 'down',
            'go north', 'go south', 'go east', 'go west', 'go up', 'go down',
            
            // Interaction commands
            'look', 'look around', 'examine', 'take', 'get', 'use', 'open', 'close',
            'talk', 'speak', 'ask', 'give', 'drop',
            
            // System commands
            'inventory', 'i', 'map', 'help', 'save', 'load', 'clear', 'quit',
            'status', 'health', 'stats',
            
            // Common phrases
            'look at', 'talk to', 'examine the', 'take the', 'use the',
            'go to', 'search', 'listen', 'wait'
        ];
    }

    handleKeyDown(e) {
        const input = this.elements.commandInput;
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.processCommand(input.value.trim());
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
                
            case 'Tab':
                e.preventDefault();
                this.autoComplete();
                break;
                
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }

    handleInput(e) {
        const value = e.target.value.toLowerCase();
        
        if (value.length > 0) {
            this.showSuggestions(value);
        } else {
            this.hideSuggestions();
        }
    }

    showSuggestions(input) {
        const matches = this.suggestedCommands.filter(cmd => 
            cmd.toLowerCase().startsWith(input.toLowerCase())
        ).slice(0, 6);

        if (matches.length > 0) {
            this.elements.inputSuggestions.innerHTML = matches
                .map(cmd => `<div class="suggestion-item">${cmd}</div>`)
                .join('');
            this.elements.inputSuggestions.style.display = 'block';
        } else {
            this.hideSuggestions();
        }
    }

    hideSuggestions() {
        this.elements.inputSuggestions.style.display = 'none';
    }

    selectSuggestion(suggestion) {
        this.elements.commandInput.value = suggestion;
        this.hideSuggestions();
        this.elements.commandInput.focus();
    }

    autoComplete() {
        const input = this.elements.commandInput.value.toLowerCase();
        const match = this.suggestedCommands.find(cmd => 
            cmd.toLowerCase().startsWith(input.toLowerCase())
        );
        
        if (match) {
            this.elements.commandInput.value = match;
            this.hideSuggestions();
        }
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === -1) { // Up arrow
            this.historyIndex = Math.max(0, this.historyIndex - 1);
        } else { // Down arrow
            this.historyIndex = Math.min(this.commandHistory.length - 1, this.historyIndex + 1);
        }
        
        this.elements.commandInput.value = this.commandHistory[this.historyIndex] || '';
    }

    async processCommand(command) {
        if (!command) return;

        // Add to history
        this.commandHistory.unshift(command);
        this.historyIndex = -1;

        // Echo command
        this.addToHistory(`[${this.currentLocation}]> ${command}`, 'command-input-echo');

        // Clear input
        this.elements.commandInput.value = '';

        // Show loading
        this.showLoading();

        try {
            // Process the command
            const result = await this.executeCommand(command);
            this.displayCommandResult(result);
        } catch (error) {
            this.displayError(`Error processing command: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async executeCommand(command) {
        const cmd = command.toLowerCase().trim();
        const parts = cmd.split(' ');
        const action = parts[0];
        const args = parts.slice(1);

        // Handle system commands first
        switch (action) {
            case 'help':
                return this.handleHelp();
            case 'clear':
                return this.handleClear();
            case 'inventory':
            case 'i':
                return this.handleInventory();
            case 'map':
                return this.handleMap();
            case 'save':
                return this.handleSave();
            case 'load':
                return this.handleLoad();
            case 'quit':
            case 'exit':
                return this.handleQuit();
            case 'status':
                return this.handleStatus();
        }

        // Handle game commands via API
        return await this.sendGameCommand(command);
    }

    async sendGameCommand(command) {
        if (this.gameClient && this.gameState !== 'OFFLINE') {
            // Use real game client
            return await this.gameClient.processCommand(command);
        } else {
            // Fallback to mock response for offline mode
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            return {
                success: true,
                type: 'action_result',
                message: `[OFFLINE MODE] You attempt to ${command}. The world responds to your action in mysterious ways.`,
                roomDescription: `You are in a dimly lit chamber. The air is thick with the scent of ancient secrets.`,
                items: ['Ancient Tome', 'Rusty Key'],
                npcs: [],
                exits: ['north', 'east'],
                playerStatus: {
                    health: 100,
                    location: 'Mysterious Chamber'
                }
            };
        }
    }

    displayCommandResult(result) {
        if (result.type === 'error') {
            this.displayError(result.message);
            return;
        }

        // Display main message
        if (result.message) {
            this.addToHistory(result.message, 'command-output');
        }

        // Update room description if provided
        if (result.roomDescription) {
            this.displayRoomDescription(result.roomDescription);
        }

        // Update player status
        if (result.playerStatus) {
            this.updatePlayerStatus(result.playerStatus);
        }

        // Handle special results
        if (result.dialogue) {
            this.displayNPCDialogue(result.dialogue);
        }

        if (result.items || result.npcs || result.exits) {
            this.updateRoomInfo(result.items, result.npcs, result.exits);
        }
    }

    displayRoomDescription(description) {
        this.elements.narrativeSection.innerHTML = `
            <div class="room-description glow-text">${description}</div>
        `;
    }

    displayNPCDialogue(dialogue) {
        this.elements.npcDialogue.innerHTML = `
            <div class="npc-name">${dialogue.npcName}:</div>
            <div class="npc-speech">"${dialogue.text}"</div>
            ${dialogue.choices ? this.formatDialogueChoices(dialogue.choices) : ''}
        `;
        this.elements.npcDialogue.style.display = 'block';
    }

    formatDialogueChoices(choices) {
        return `
            <div class="dialogue-choices">
                ${choices.map((choice, index) => 
                    `<div class="dialogue-choice" onclick="terminal.selectDialogueChoice(${index})">${index + 1}. ${choice}</div>`
                ).join('')}
            </div>
        `;
    }

    selectDialogueChoice(choiceIndex) {
        // Process dialogue choice
        this.elements.npcDialogue.style.display = 'none';
        this.processCommand(`respond ${choiceIndex + 1}`);
    }

    updateRoomInfo(items, npcs, exits) {
        let roomInfo = '';
        
        if (items && items.length > 0) {
            roomInfo += `<div class="room-items">Items here: ${items.join(', ')}</div>`;
        }
        
        if (npcs && npcs.length > 0) {
            roomInfo += `<div class="room-npcs">You see: ${npcs.map(npc => npc.name || npc).join(', ')}</div>`;
        }
        
        if (exits && exits.length > 0) {
            roomInfo += `<div class="room-exits">Exits: ${exits.join(', ')}</div>`;
        }

        if (roomInfo) {
            this.elements.narrativeSection.innerHTML += roomInfo;
        }
    }

    updatePlayerStatus(status) {
        if (status.health !== undefined) {
            this.elements.playerHealth.textContent = status.health;
        }
        if (status.location) {
            this.currentLocation = status.location;
            this.elements.currentLocation.textContent = status.location;
            this.elements.promptLocation.textContent = status.location.substring(0, 12);
        }
        if (status.level) {
            this.elements.playerLevel.textContent = status.level;
        }
    }

    // System command handlers
    handleHelp() {
        this.elements.helpPanel.style.display = 'block';
        return { success: true, message: 'Help panel opened. Press ESC to close.' };
    }

    handleClear() {
        this.elements.commandHistory.innerHTML = '';
        this.elements.narrativeSection.innerHTML = '';
        this.elements.actionFeedback.innerHTML = '';
        this.elements.npcDialogue.style.display = 'none';
        return { success: true, message: 'Terminal cleared.' };
    }

    async handleInventory() {
        if (this.gameClient && this.gameState !== 'OFFLINE') {
            const inventoryResult = await this.gameClient.getInventory();
            if (inventoryResult.success) {
                this.displayInventory(inventoryResult.items || []);
            }
        }
        
        this.togglePanel('inventoryPanel');
        return { success: true, message: 'Inventory panel toggled.' };
    }

    async handleMap() {
        if (this.gameClient && this.gameState !== 'OFFLINE') {
            const mapResult = await this.gameClient.getMap();
            if (mapResult.success) {
                this.displayMap(mapResult.map);
            }
        }
        
        this.togglePanel('mapPanel');
        return { success: true, message: 'Map panel toggled.' };
    }

    async handleSave() {
        if (this.gameClient && this.gameState !== 'OFFLINE') {
            const saveResult = await this.gameClient.saveGame('quicksave');
            if (saveResult.success) {
                return { success: true, message: 'Game state saved successfully.' };
            } else {
                return { success: false, message: `Save failed: ${saveResult.message}` };
            }
        }
        return { success: true, message: '[OFFLINE MODE] Game state saved locally.' };
    }

    async handleLoad() {
        if (this.gameClient && this.gameState !== 'OFFLINE') {
            const loadResult = await this.gameClient.loadSavedGame('quicksave');
            if (loadResult.success) {
                // Update UI with loaded game state
                if (loadResult.gameState && loadResult.gameState.player) {
                    this.updatePlayerFromGameState(loadResult.gameState);
                }
                return { success: true, message: 'Game state loaded successfully.' };
            } else {
                return { success: false, message: `Load failed: ${loadResult.message}` };
            }
        }
        return { success: true, message: '[OFFLINE MODE] Game state loaded from local storage.' };
    }

    handleQuit() {
        if (confirm('Are you sure you want to quit the game?')) {
            return { success: true, message: 'Thanks for playing Quest Weaver!' };
        }
        return { success: true, message: 'Continuing game.' };
    }

    handleStatus() {
        return { 
            success: true, 
            message: `Status: ${this.gameState} | Location: ${this.currentLocation} | Player: ${this.playerName}` 
        };
    }

    // Utility methods
    addToHistory(text, className = 'command-output') {
        const entry = document.createElement('div');
        entry.className = `command-entry ${className}`;
        entry.textContent = text;
        this.elements.commandHistory.appendChild(entry);
        
        // Auto-scroll to bottom
        this.elements.terminalDisplay.scrollTop = this.elements.terminalDisplay.scrollHeight;
    }

    displayError(message) {
        this.addToHistory(`ERROR: ${message}`, 'command-output error-text');
    }

    showLoading() {
        this.elements.loadingOverlay.style.display = 'flex';
        this.updateGameStatus('PROCESSING');
    }

    hideLoading() {
        this.elements.loadingOverlay.style.display = 'none';
        this.updateGameStatus('READY');
    }

    updateGameStatus(status) {
        this.gameState = status;
        this.elements.gameStatus.textContent = status;
    }

    togglePanel(panelId) {
        const panel = this.elements[panelId];
        const isActive = panel.classList.contains('active');
        
        // Close all panels first
        this.closeAllPanels();
        
        // Toggle the requested panel
        if (!isActive) {
            panel.classList.add('active');
        }
    }

    closeAllPanels() {
        this.elements.inventoryPanel.classList.remove('active');
        this.elements.mapPanel.classList.remove('active');
        this.elements.helpPanel.style.display = 'none';
    }

    displayWelcomeMessage() {
        const welcomeMsg = `
╔══════════════════════════════════════════════════════════════╗
║                      QUEST WEAVER v2.1                      ║
║                  Neural Narrative Engine                     ║
╚══════════════════════════════════════════════════════════════╝

Welcome, traveler, to a world where your choices shape reality.
Type 'help' for available commands or simply begin exploring.
Your adventure awaits...

        `;
        
        this.elements.narrativeSection.innerHTML = `<pre class="glow-text">${welcomeMsg}</pre>`;
        this.updateGameStatus('ACTIVE');
    }

    // Handle game state updates from backend
    updatePlayerFromGameState(gameState) {
        if (gameState.player) {
            const player = gameState.player;
            
            if (player.name) {
                this.playerName = player.name;
                this.elements.playerName.textContent = player.name;
            }
            
            if (player.stats) {
                this.elements.playerHealth.textContent = player.stats.health || 100;
                this.elements.playerLevel.textContent = player.stats.level || 1;
            }
            
            if (player.position && gameState.rooms) {
                // Find current room based on player position
                const currentRoom = Object.values(gameState.rooms).find(room => {
                    return player.position.x >= room.position.x &&
                           player.position.x <= room.position.x + room.size.width &&
                           player.position.y >= room.position.y &&
                           player.position.y <= room.position.y + room.size.height;
                });
                
                if (currentRoom) {
                    this.currentLocation = currentRoom.name;
                    this.elements.currentLocation.textContent = currentRoom.name;
                    this.elements.promptLocation.textContent = currentRoom.name.substring(0, 12);
                }
            }
        }
    }

    // Display inventory items
    displayInventory(items) {
        const inventoryContent = this.elements.inventoryPanel.querySelector('.panel-content');
        
        if (items.length === 0) {
            inventoryContent.innerHTML = '<div class="empty-message">No items</div>';
        } else {
            const itemsHtml = items.map(item => `
                <div class="inventory-item">
                    <span class="item-name">${item.name || item}</span>
                    <span class="item-quantity">${item.quantity || 1}</span>
                </div>
            `).join('');
            
            inventoryContent.innerHTML = itemsHtml;
        }
    }

    // Display map
    displayMap(mapData) {
        const mapContent = this.elements.mapPanel.querySelector('#asciiMap');
        
        if (mapData && mapData.ascii) {
            mapContent.textContent = mapData.ascii;
        } else if (mapData && typeof mapData === 'string') {
            mapContent.textContent = mapData;
        } else {
            // Default unknown area map
            mapContent.textContent = `
    ┌───────────────────┐
    │   UNKNOWN AREA    │
    │                   │
    │        [?]        │
    │                   │
    └───────────────────┘`;
        }
    }

    // Handle real-time NPC actions
    displayNPCAction(data) {
        if (data.message) {
            this.addToHistory(`[NPC ACTION] ${data.message}`, 'action-info');
        }
        
        if (data.dialogue) {
            this.displayNPCDialogue(data.dialogue);
        }
    }

    // Handle environmental events
    displayEnvironmentalEvent(data) {
        if (data.message) {
            this.addToHistory(`[ENVIRONMENTAL] ${data.message}`, 'action-feedback');
        }
        
        if (data.soundEffect) {
            // Could trigger audio effects here in the future
            console.log('Sound effect:', data.soundEffect);
        }
    }

    // Update game state from WebSocket
    updateGameState(gameState) {
        this.updatePlayerFromGameState(gameState);
        
        // Update any other UI elements based on game state
        if (gameState.currentRoom) {
            this.displayRoomDescription(gameState.currentRoom.description);
            
            if (gameState.currentRoom.items || gameState.currentRoom.npcs || gameState.currentRoom.exits) {
                this.updateRoomInfo(
                    gameState.currentRoom.items,
                    gameState.currentRoom.npcs,
                    gameState.currentRoom.exits
                );
            }
        }
    }
}

// Initialize the terminal interface when DOM is loaded
let terminal;
document.addEventListener('DOMContentLoaded', () => {
    terminal = new TerminalInterface();
});

// Export for global access
window.TerminalInterface = TerminalInterface;