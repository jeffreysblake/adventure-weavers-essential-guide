/**
 * Player Navigation System for Quest Weaver
 * Handles player movement between rooms and interaction with items
 */

import { Room } from './room-system';
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
}