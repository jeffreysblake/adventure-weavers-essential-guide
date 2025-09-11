/**
 * Game State Manager for Quest Weaver
 * Comprehensive save/load functionality for all game systems
 */

import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { NavigationSystem } from './player-navigation';
import { NPCManager } from './npc-manager';

export interface GameState {
  version: string;
  timestamp: number;
  players: Map<string, PlayerState>;
  items: Map<string, ItemState>;
  rooms: Map<string, RoomState>;
  npcs: Map<string, NPCState>;
  verticalConnections: Map<string, VerticalConnection>;
  gameEvents: GameEvent[];
  questProgress: Map<string, QuestState>;
}

export interface PlayerState {
  id: string;
  name: string;
  currentRoomId: string;
  position: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  stats: any;
  experience: number;
  level: number;
  inventoryItems: string[];
}

export interface NPCState {
  id: string;
  name: string;
  npcType: string;
  currentRoomId: string;
  position: { x: number; y: number; z: number };
  currentState: string;
  health: number;
  stats: any;
  inventory: any[];
  faction?: string;
  hostileToFactions?: string[];
  friendlyToFactions?: string[];
  currentDialogueNode?: string;
  knownEvents: any[];
  lastSeenPlayer?: any;
  sensoryRange: number;
  sensoryTypes: string[];
}

export interface ItemState {
  id: string;
  name: string;
  description: string;
  roomId?: string;
  containerItemId?: string;
  position: { x: number; y: number; z: number };
  spatialRelationships?: any;
  material?: string;
  attributes?: any;
  state?: 'active' | 'used' | 'destroyed';
}

export interface RoomState {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  items: string[];
  connections: Record<string, string>;
  verticalConnections: Record<string, string>; // up, down connections
  environmentalState?: any;
}

export interface VerticalConnection {
  id: string;
  fromRoomId: string;
  toRoomId: string;
  connectionType: 'stairs_up' | 'stairs_down' | 'rope_up' | 'rope_down' | 'ladder' | 'vine' | 'slide';
  description: string;
  requirements?: string[]; // items needed to use this connection
  difficulty?: number; // chance of success
}

export interface GameEvent {
  id: string;
  type: string;
  timestamp: number;
  roomId: string;
  playerId?: string;
  npcId?: string;
  data: any;
}

export interface QuestState {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  currentStep: number;
  variables: Map<string, any>;
  startTimestamp?: number;
  completionTimestamp?: number;
}

export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  gameState: GameState;
  playerName: string;
  playerLevel: number;
  currentLocation: string;
  screenshot?: string;
}

export class GameStateManager {
  private gameState: GameState;
  private saveSlots: Map<string, SaveSlot> = new Map();
  private autosaveEnabled: boolean = true;
  private autosaveInterval: number = 300000; // 5 minutes
  private lastAutosave: number = 0;
  
  constructor(
    private roomSystem: RoomSystem,
    private itemSystem: ItemSystem,
    private npcManager?: NPCManager
  ) {
    this.gameState = this.initializeEmptyGameState();
    this.loadSaveSlots();
  }

  private initializeEmptyGameState(): GameState {
    return {
      version: '1.0.0',
      timestamp: Date.now(),
      players: new Map(),
      items: new Map(),
      rooms: new Map(),
      npcs: new Map(),
      verticalConnections: new Map(),
      gameEvents: [],
      questProgress: new Map()
    };
  }

  // ===== SAVE/LOAD FUNCTIONALITY =====

  /**
   * Create a complete snapshot of current game state
   */
  createSnapshot(): GameState {
    const snapshot: GameState = {
      version: '1.0.0',
      timestamp: Date.now(),
      players: new Map(this.gameState.players),
      items: new Map(this.gameState.items),
      rooms: new Map(this.gameState.rooms),
      npcs: new Map(this.gameState.npcs),
      verticalConnections: new Map(this.gameState.verticalConnections),
      gameEvents: [...this.gameState.gameEvents],
      questProgress: new Map(this.gameState.questProgress)
    };

    return snapshot;
  }

  /**
   * Save game to a named slot
   */
  saveGame(slotName: string, playerId?: string): SaveSlot {
    const snapshot = this.createSnapshot();
    const player = playerId ? this.gameState.players.get(playerId) : this.gameState.players.values().next().value;
    
    const saveSlot: SaveSlot = {
      id: this.generateSaveId(),
      name: slotName,
      timestamp: Date.now(),
      gameState: snapshot,
      playerName: player?.name || 'Unknown Player',
      playerLevel: player?.level || 1,
      currentLocation: this.roomSystem.getRoom(player?.currentRoomId || '')?.name || 'Unknown Location'
    };

    this.saveSlots.set(saveSlot.id, saveSlot);
    this.persistSaveSlots();
    
    console.log(`Game saved: ${slotName}`);
    return saveSlot;
  }

  /**
   * Load game from save slot
   */
  loadGame(saveSlotId: string): boolean {
    const saveSlot = this.saveSlots.get(saveSlotId);
    if (!saveSlot) {
      console.error(`Save slot not found: ${saveSlotId}`);
      return false;
    }

    // Clear current game state
    this.clearGameState();
    
    // Restore game state
    this.gameState = this.deepCloneGameState(saveSlot.gameState);
    
    // Restore systems from state
    this.restoreGameSystems();
    
    console.log(`Game loaded: ${saveSlot.name}`);
    return true;
  }

  /**
   * Get all save slots
   */
  getSaveSlots(): SaveSlot[] {
    return Array.from(this.saveSlots.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Delete save slot
   */
  deleteSave(saveSlotId: string): boolean {
    const deleted = this.saveSlots.delete(saveSlotId);
    if (deleted) {
      this.persistSaveSlots();
      console.log(`Save deleted: ${saveSlotId}`);
    }
    return deleted;
  }

  // ===== PLAYER MANAGEMENT =====

  initializePlayer(playerId: string, playerName: string, initialRoomId: string, position: { x: number; y: number; z: number }): void {
    const playerState: PlayerState = {
      id: playerId,
      name: playerName,
      currentRoomId: initialRoomId,
      position: { ...position },
      health: 100,
      maxHealth: 100,
      stats: { strength: 10, dexterity: 10, intelligence: 10, charisma: 10 },
      experience: 0,
      level: 1,
      inventoryItems: []
    };
    
    this.gameState.players.set(playerId, playerState);
    this.recordEvent('player_initialized', initialRoomId, playerId, { playerName, initialRoomId });
  }

  movePlayerToRoom(playerId: string, newRoomId: string): boolean {
    const player = this.gameState.players.get(playerId);
    if (!player) return false;
    
    const oldRoomId = player.currentRoomId;
    player.currentRoomId = newRoomId;
    
    this.recordEvent('player_moved', newRoomId, playerId, { from: oldRoomId, to: newRoomId });
    return true;
  }

  getPlayerState(playerId: string): PlayerState | undefined {
    return this.gameState.players.get(playerId);
  }

  // ===== NPC MANAGEMENT =====

  syncNPCState(npc: any): void {
    const npcState: NPCState = {
      id: npc.id,
      name: npc.name,
      npcType: npc.npcType,
      currentRoomId: this.findNPCRoom(npc),
      position: { ...npc.position },
      currentState: npc.currentState,
      health: npc.health,
      stats: { ...npc.stats },
      inventory: [...(npc.inventory || [])],
      faction: npc.faction,
      hostileToFactions: npc.hostileToFactions ? [...npc.hostileToFactions] : [],
      friendlyToFactions: npc.friendlyToFactions ? [...npc.friendlyToFactions] : [],
      currentDialogueNode: npc.currentDialogueNode,
      knownEvents: [...(npc.knownEvents || [])],
      lastSeenPlayer: npc.lastSeenPlayer,
      sensoryRange: npc.sensoryRange,
      sensoryTypes: [...npc.sensoryTypes]
    };
    
    this.gameState.npcs.set(npc.id, npcState);
  }

  private findNPCRoom(npc: any): string {
    // Find which room the NPC is currently in based on position
    const rooms = this.roomSystem.getAllRooms();
    for (const room of rooms) {
      if (npc.position.x >= room.position.x && 
          npc.position.x <= room.position.x + room.size.width &&
          npc.position.y >= room.position.y && 
          npc.position.y <= room.position.y + room.size.height) {
        return room.id;
      }
    }
    return 'unknown';
  }

  // ===== VERTICAL NAVIGATION =====

  createVerticalConnection(
    fromRoomId: string,
    toRoomId: string,
    connectionType: VerticalConnection['connectionType'],
    description: string,
    requirements?: string[],
    difficulty?: number
  ): string {
    const connectionId = `vertical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const connection: VerticalConnection = {
      id: connectionId,
      fromRoomId,
      toRoomId,
      connectionType,
      description,
      requirements,
      difficulty
    };
    
    this.gameState.verticalConnections.set(connectionId, connection);
    
    // Update room connections
    const fromRoom = this.gameState.rooms.get(fromRoomId);
    if (fromRoom) {
      const direction = connectionType.includes('up') ? 'up' : 'down';
      fromRoom.verticalConnections[direction] = connectionId;
    }
    
    return connectionId;
  }

  getVerticalConnections(roomId: string): VerticalConnection[] {
    return Array.from(this.gameState.verticalConnections.values())
      .filter(conn => conn.fromRoomId === roomId || conn.toRoomId === roomId);
  }

  // ===== EVENT TRACKING =====

  recordEvent(type: string, roomId: string, playerId?: string, data?: any): void {
    const event: GameEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      roomId,
      playerId,
      data: data || {}
    };
    
    this.gameState.gameEvents.push(event);
    
    // Keep only recent events (last 1000)
    if (this.gameState.gameEvents.length > 1000) {
      this.gameState.gameEvents = this.gameState.gameEvents.slice(-1000);
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private deepCloneGameState(gameState: GameState): GameState {
    return JSON.parse(JSON.stringify(gameState, this.mapReplacer), this.mapReviver);
  }

  private mapReplacer(key: string, value: any): any {
    if (value instanceof Map) {
      return { __type: 'Map', data: Array.from(value.entries()) };
    }
    return value;
  }

  private mapReviver(key: string, value: any): any {
    if (value && value.__type === 'Map') {
      return new Map(value.data);
    }
    return value;
  }

  private clearGameState(): void {
    this.gameState.players.clear();
    this.gameState.items.clear();
    this.gameState.rooms.clear();
    this.gameState.npcs.clear();
    this.gameState.verticalConnections.clear();
    this.gameState.gameEvents = [];
    this.gameState.questProgress.clear();
  }

  private restoreGameSystems(): void {
    // This would restore all systems from the saved state
    // Implementation depends on how we want to integrate with existing systems
    console.log('Restoring game systems from saved state...');
    
    // Sync NPCs if manager is available
    if (this.npcManager) {
      for (const [npcId, npcState] of this.gameState.npcs) {
        // Would need to recreate NPC objects and add them to manager
        console.log(`Restoring NPC: ${npcState.name}`);
      }
    }
  }

  private persistSaveSlots(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saveData = JSON.stringify(Array.from(this.saveSlots.entries()), this.mapReplacer);
        localStorage.setItem('quest_weaver_saves', saveData);
      } else {
        console.log('Save slots persisted to memory');
      }
    } catch (error) {
      console.error('Failed to persist save slots:', error);
    }
  }

  private loadSaveSlots(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saveData = localStorage.getItem('quest_weaver_saves');
        if (saveData) {
          const entries = JSON.parse(saveData, this.mapReviver);
          this.saveSlots = new Map(entries);
        }
      } else {
        console.log('Save slots loaded from memory');
      }
    } catch (error) {
      console.error('Failed to load save slots:', error);
    }
  }

  private generateSaveId(): string {
    return `save_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
  }

  // Legacy methods for backward compatibility
  addItemToGame(item: any, roomId?: string): void {
    const itemState: ItemState = {
      id: item.id,
      name: item.name || 'Unknown Item',
      description: item.description || '',
      roomId,
      position: item.position || { x: 0, y: 0, z: 0 },
      material: item.material,
      attributes: item.attributes,
      state: 'active'
    };
    
    this.gameState.items.set(item.id, itemState);
  }

  updateItemLocation(itemId: string, roomId?: string, containerItemId?: string): boolean {
    const item = this.gameState.items.get(itemId);
    if (!item) return false;
    
    item.roomId = roomId;
    item.containerItemId = containerItemId;
    
    return true;
  }

  getGameState(): GameState {
    return this.gameState;
  }
}
