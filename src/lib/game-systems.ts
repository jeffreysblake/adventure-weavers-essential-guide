/**
 * Game Systems for Quest Weaver
 * Combines room, item and navigation systems into a cohesive game engine
 */

import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { NavigationSystem } from './player-navigation';
import { PlayerInteractionSystem } from './player-interaction';
import { InventorySystem } from './inventory-system';
import { EnvironmentalInteractionsSystem } from './environmental-interactions';
import { NPCManager } from './npc-manager';

export class GameSystems {
  private roomSystem: RoomSystem;
  private itemSystem: ItemSystem;
  private navigationSystem: NavigationSystem;
  private interactionSystem: PlayerInteractionSystem;
  private inventorySystem: InventorySystem;
  private environmentalInteractionsSystem: EnvironmentalInteractionsSystem;
  private npcManager: NPCManager;
  
  constructor() {
    this.roomSystem = new RoomSystem();
    this.itemSystem = new ItemSystem();
    this.navigationSystem = new NavigationSystem(this.roomSystem, this.itemSystem);
    this.interactionSystem = new PlayerInteractionSystem(this.itemSystem, this.roomSystem);
    this.inventorySystem = new InventorySystem(this.itemSystem);
    this.environmentalInteractionsSystem = new EnvironmentalInteractionsSystem(this.itemSystem, this.roomSystem);
    this.npcManager = new NPCManager(this.roomSystem, this.itemSystem);
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
  
  /**
   * Get the interaction system
   */
  getInteractionSystem(): PlayerInteractionSystem {
    return this.interactionSystem;
  }
  
  /**
   * Get the inventory system
   */
  getInventorySystem(): InventorySystem {
    return this.inventorySystem;
  }
  
  /**
   * Get the environmental interactions system
   */
  getEnvironmentalInteractionsSystem(): EnvironmentalInteractionsSystem {
    return this.environmentalInteractionsSystem;
  }

  /**
   * Get the NPC manager
   */
  getNPCManager(): NPCManager {
    return this.npcManager;
  }
}