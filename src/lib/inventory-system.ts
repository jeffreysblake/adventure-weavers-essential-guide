/**
 * Inventory System for Quest Weaver
 * Handles player inventories with advanced features
 */

import { ItemSystem } from './item-system';

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export class InventorySystem {
  private itemSystem: ItemSystem;
  private playerInventories: Map<string, InventorySlot[]> = new Map();
  
  constructor(itemSystem: ItemSystem) {
    this.itemSystem = itemSystem;
  }
  
  /**
   * Initialize a player's inventory
   */
  initializePlayerInventory(playerId: string): void {
    if (!this.playerInventories.has(playerId)) {
      this.playerInventories.set(playerId, []);
    }
  }
  
  /**
   * Add an item to a player's inventory
   */
  addItemToInventory(playerId: string, itemId: string): boolean {
    const inventory = this.playerInventories.get(playerId) || [];
    
    // Check if the item is already in inventory
    const existingSlotIndex = inventory.findIndex(slot => slot.itemId === itemId);
    
    if (existingSlotIndex !== -1) {
      // Increase quantity if item exists
      inventory[existingSlotIndex].quantity += 1;
    } else {
      // Add new slot for the item
      inventory.push({
        itemId,
        quantity: 1
      });
    }
    
    this.playerInventories.set(playerId, inventory);
    return true;
  }
  
  /**
   * Remove an item from a player's inventory
   */
  removeItemFromInventory(playerId: string, itemId: string): boolean {
    const inventory = this.playerInventories.get(playerId) || [];
    
    // Find the slot with the item
    const existingSlotIndex = inventory.findIndex(slot => slot.itemId === itemId);
    
    if (existingSlotIndex !== -1) {
      // Decrease quantity or remove slot entirely
      if (inventory[existingSlotIndex].quantity > 1) {
        inventory[existingSlotIndex].quantity -= 1;
      } else {
        inventory.splice(existingSlotIndex, 1);
      }
      
      this.playerInventories.set(playerId, inventory);
      return true;
    }
    
    return false; // Item not found
  }
  
  /**
   * Get a player's inventory
   */
  getPlayerInventory(playerId: string): InventorySlot[] {
    return this.playerInventories.get(playerId) || [];
  }
  
  /**
   * Check if a player has an item in their inventory
   */
  hasItem(playerId: string, itemId: string): boolean {
    const inventory = this.getPlayerInventory(playerId);
    return inventory.some(slot => slot.itemId === itemId);
  }
  
  /**
   * Get the quantity of a specific item in inventory
   */
  getItemCount(playerId: string, itemId: string): number {
    const inventory = this.getPlayerInventory(playerId);
    const slot = inventory.find(slot => slot.itemId === itemId);
    return slot ? slot.quantity : 0;
  }
}