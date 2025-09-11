/**
 * Player Interaction System for Quest Weaver
 * Handles player actions like using items, opening containers, etc.
 */

import { ItemSystem } from './item-system';
import { RoomSystem } from './room-system';

export interface PlayerInteractionResult {
  success: boolean;
  message: string;
  updatedItems?: any[]; // Updated item states if applicable
}

export class PlayerInteractionSystem {
  private itemSystem: ItemSystem;
  private roomSystem: RoomSystem;
  
  constructor(itemSystem: ItemSystem, roomSystem: RoomSystem) {
    this.itemSystem = itemSystem;
    this.roomSystem = roomSystem;
  }
  
  /**
   * Use an item (like a potion)
   */
  useItem(playerId: string, itemId: string): PlayerInteractionResult {
    const inventory = this.itemSystem.getInventory(playerId);
    if (!inventory) {
      return {
        success: false,
        message: "Player has no inventory"
      };
    }
    
    // Find the item in player's inventory
    const itemIndex = inventory.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return {
        success: false,
        message: "Item not found in player's inventory"
      };
    }
    
    const item = inventory.items[itemIndex];
    
    // Handle specific item effects
    switch(item.name.toLowerCase()) {
      case 'fireball potion':
        return this.useFireballPotion(playerId, item);
      default:
        return {
          success: true,
          message: `Used ${item.name}`
        };
    }
  }
  
  /**
   * Use a fireball potion
   */
  private useFireballPotion(playerId: string, item: any): PlayerInteractionResult {
    // Update the potion state to indicate it's been used
    this.itemSystem.updateItemState(item.id, 'burned');
    
    return {
      success: true,
      message: "You throw the fireball potion! It explodes with a bright flash of light."
    };
  }
  
  /**
   * Open a container (like chest)
   */
  openContainer(playerId: string, containerItemId: string): PlayerInteractionResult {
    const inventory = this.itemSystem.getInventory(playerId);
    if (!inventory) {
      return {
        success: false,
        message: "Player has no inventory"
      };
    }
    
    // Find the container in player's inventory
    const itemIndex = inventory.items.findIndex(item => item.id === containerItemId);
    if (itemIndex === -1) {
      return {
        success: false,
        message: "Container not found in player's inventory"
      };
    }
    
    // Check if it's a container
    const item = inventory.items[itemIndex];
    if (!item.isContainer || !item.containedItems) {
      return {
        success: false,
        message: "Item is not a container"
      };
    }
    
    // Return the items inside the container
    const containedItems = this.itemSystem.openContainer(playerId, containerItemId);
    
    return {
      success: true,
      message: `You open ${item.name} and find:`,
      updatedItems: containedItems
    };
  }
  
  /**
   * Interact with an item in the environment (like burning a tree)
   */
  interactWithItem(playerId: string, itemId: string, action: 'burn' | 'explode' | 'unlock'): PlayerInteractionResult {
    const inventory = this.itemSystem.getInventory(playerId);
    if (!inventory) {
      return {
        success: false,
        message: "Player has no inventory"
      };
    }
    
    // Find the item in player's inventory
    const itemIndex = inventory.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return {
        success: false,
        message: "Item not found in player's inventory"
      };
    }
    
    // Handle interaction based on action type and item properties
    const item = inventory.items[itemIndex];
    
    switch(action) {
      case 'burn':
        // Use fire potion to burn environmental items
        if (item.name.toLowerCase().includes('fire') || item.name.toLowerCase().includes('fireball')) {
          // Find burnable items in the environment (like trees)
          const burnableItems = ['tree-1']; // In a real implementation, this would be dynamic
          for (const burnableId of burnableItems) {
            this.itemSystem.updateItemState(burnableId, 'burned');
          }
          // Mark the potion as used
          this.itemSystem.updateItemState(itemId, 'used');
          return {
            success: true,
            message: "You use the fire potion to burn nearby items."
          };
        } else {
          this.itemSystem.updateItemState(itemId, 'burned');
          return {
            success: true,
            message: "You burn the item. It turns to ash."
          };
        }
      case 'explode':
        // Use explosive potion to shatter environmental items
        if (item.name.toLowerCase().includes('explosive')) {
          // Find breakable items in the environment (like glass)
          const breakableItems = ['vase-1']; // In a real implementation, this would be dynamic
          for (const breakableId of breakableItems) {
            this.itemSystem.updateItemState(breakableId, 'shattered');
          }
          // Mark the potion as used
          this.itemSystem.updateItemState(itemId, 'used');
          return {
            success: true,
            message: "You use the explosive potion to shatter nearby items."
          };
        } else {
          this.itemSystem.updateItemState(itemId, 'shattered');
          return {
            success: true,
            message: "You explode the item! It shatters into pieces."
          };
        }
      case 'unlock':
        // In a real implementation, check if player has key
        this.itemSystem.updateItemState(itemId, 'unlocked');
        return {
          success: true,
          message: "You unlock the item with your key."
        };
      default:
        return {
          success: false,
          message: "Unknown interaction action"
        };
    }
  }
}