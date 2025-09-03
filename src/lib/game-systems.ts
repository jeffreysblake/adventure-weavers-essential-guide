/**
 * Game Systems for Quest Weaver
 * Combines room, item and navigation systems into a cohesive game engine
 */

import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { NavigationSystem } from './player-navigation';

export class GameSystems {
  private roomSystem: RoomSystem;
  private itemSystem: ItemSystem;
  private navigationSystem: NavigationSystem;
  
  constructor() {
    this.roomSystem = new RoomSystem();
    this.itemSystem = new ItemSystem();
    this.navigationSystem = new NavigationSystem();
  }
  
  /**
   * Get the room system
   */
  getRoomSystem(): RoomSystem {
    return this.roomSystem;
  }
  
  /**
   * Get the item system
   */
  getItemSystem(): ItemSystem {
    return this.itemSystem;
  }
  
  /**
   * Get the navigation system
   */
  getNavigationSystem(): NavigationSystem {
    return this.navigationSystem;
  }
}