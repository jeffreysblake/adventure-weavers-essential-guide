/**
 * Environmental Interactions System for Quest Weaver
 * Handles player interactions with the environment (like throwing potions at brambles)
 */

import { ItemSystem } from './item-system';
import { RoomSystem } from './room-system';

export interface EnvironmentalInteractionResult {
  success: boolean;
  message: string;
  environmentalEffect?: EnvironmentalEffect;
}

export interface EnvironmentalEffect {
  type: 'fireball' | 'explosion' | 'light' | 'bramble_damage';
  intensity: number; // 0-100
  description: string;
}

export class EnvironmentalInteractionsSystem {
  private itemSystem: ItemSystem;
  private roomSystem: RoomSystem;
  
  constructor(itemSystem: ItemSystem, roomSystem: RoomSystem) {
    this.itemSystem = itemSystem;
    this.roomSystem = roomSystem;
  }
  
  /**
   * Throw an item at the environment (like brambles)
   */
  throwAtEnvironment(playerId: string, itemId: string, targetEnvironment?: string): EnvironmentalInteractionResult {
    // Check if player has the item
    const inventory = this.itemSystem.getInventory(playerId);
    
    if (!inventory) {
      return {
        success: false,
        message: "You don't have that item."
      };
    }
    
    // Check if it's a throw-able item
    const item = inventory.items.find(i => i.id === itemId);
    
    if (!item) {
      return {
        success: false,
        message: "You don't have that item."
      };
    }
    
    // Handle specific environmental effects
    switch(item.name.toLowerCase()) {
      case 'fireball potion':
        return this.throwFireballPotion(playerId, itemId);
      default:
        return {
          success: true,
          message: `You throw ${item.name} at the environment. It explodes with a bright flash of light.`
        };
    }
  }
  
  /**
   * Throw a fireball potion
   */
  private throwFireballPotion(playerId: string, itemId: string): EnvironmentalInteractionResult {
    // In a real implementation this would affect the environment
    const effect: EnvironmentalEffect = {
      type: 'fireball',
      intensity: 85,
      description: "The fireball explodes with a bright flash of light."
    };
    
    return {
      success: true,
      message: "You throw the fireball potion! It explodes with a bright flash of light.",
      environmentalEffect: effect
    };
  }
}