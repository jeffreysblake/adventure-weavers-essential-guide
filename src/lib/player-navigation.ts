/**
 * Player Navigation System for Quest Weaver
 * Handles player movement between rooms and interaction with items
 */

import { RoomSystem } from './room-system';
import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { Item } from './item-system';

export interface Player {
  id: string;
  name: string;
  currentRoomId: string;
  health?: number;
  inventory: Item[];
}

export class NavigationSystem {
  private players: Map<string, Player> = new Map();
  private roomSystem: RoomSystem;
  private itemSystem: ItemSystem;
  
  constructor(roomSystem: RoomSystem, itemSystem: ItemSystem) {
    this.roomSystem = roomSystem;
    this.itemSystem = itemSystem;
  }
  
  /**
   * Create a new player
   */
  createPlayer(
    id: string,
    name: string,
    initialRoomId: string,
    health?: number
  ): Player {
    const player: Player = {
      id,
      name,
      currentRoomId: initialRoomId,
      health,
      inventory: []
    };
    
    this.players.set(id, player);
    return player;
  }
  
  /**
   * Move a player to a different room
   */
  movePlayer(playerId: string, newRoomId: string): boolean {
    const player = this.players.get(playerId);
    
    if (!player) {
      return false;
    }
    
    // Update the player's current room
    player.currentRoomId = newRoomId;
    return true;
  }
  
  /**
   * Move through a door (requires crawling if small)
   */
  moveThroughDoor(playerId: string, doorItemId: string, targetRoomId: string): boolean {
    const player = this.players.get(playerId);
    if (!player) return false;
    
    // In a real implementation, we would check if the player can fit through
    // For now, just move them to the new room
    return this.movePlayer(playerId, targetRoomId);
  }
  
  /**
   * Crawl through a small space (like under a door)
   */
  crawlThroughSpace(playerId: string, spaceItemId: string): boolean {
    // In a real implementation, we would check if the player can fit
    // and update their position in the room
    return true;
  }
  
  /**
   * Get a player by ID
   */
  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }
  
  /**
   * Get all players
   */
  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }
  
  /**
   * Remove a player by ID
   */
  removePlayer(id: string): boolean {
    return this.players.delete(id);
  }
}
import { Item } from './item-system';

export interface Player {
  id: string;
  name: string;
  currentRoomId: string;
  health?: number;
  inventory: Item[];
}

export class NavigationSystem {
  private players: Map<string, Player> = new Map();
  private roomSystem: RoomSystem;
  private itemSystem: ItemSystem;
  
  constructor(roomSystem: RoomSystem, itemSystem: ItemSystem) {
    this.roomSystem = roomSystem;
    this.itemSystem = itemSystem;
  }
  
  /**
   * Create a new player
   */
  createPlayer(
    id: string,
    name: string,
    initialRoomId: string,
    health?: number
  ): Player {
    const player: Player = {
      id,
      name,
      currentRoomId: initialRoomId,
      health,
      inventory: []
    };
    
    this.players.set(id, player);
    return player;
  }
  
  /**
   * Move a player to a different room
   */
  movePlayer(playerId: string, newRoomId: string): boolean {
    const player = this.players.get(playerId);
    
    if (!player) {
      return false;
    }
    
    // Update the player's current room
    player.currentRoomId = newRoomId;
    return true;
  }
  
  /**
   * Get a player by ID
   */
  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }
  
  /**
   * Get all players
   */
  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }
  
  /**
   * Remove a player by ID
   */
  removePlayer(id: string): boolean {
    return this.players.delete(id);
  }
  
  /**
   * Move through a door (requires crawling if small)
   */
  moveThroughDoor(playerId: string, doorItemId: string, targetRoomId: string): boolean {
    const player = this.getPlayer(playerId);
    if (!player) return false;
    
    // Check if the player has the door item (in case it's a key)
    const doorItem = player.inventory.find(item => item.id === doorItemId);
    
    // For now, we'll assume doors can be passed through
    // In a real implementation, this would check for size constraints or keys
    return this.movePlayer(playerId, targetRoomId);
  }
  
  /**
   * Crawl through a small space (like under a door)
   */
  crawlThroughSpace(playerId: string, spaceItemId: string): boolean {
    // In a real implementation, this would check if the player can fit
    // and update their position in the room
    return true;
  }
}