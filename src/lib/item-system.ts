/**
 * Item System for Quest Weaver
 * Handles items in rooms and player inventory
 */

export interface Item {
  id: string;
  name: string;
  description: string;
  type?: 'weapon' | 'armor' | 'consumable' | 'key' | 'quest-item';
  value?: number; // For currency or other values
  weight?: number;
  canTake?: boolean;
}

export interface Inventory {
  items: Item[];
}

export class ItemSystem {
  private inventory: Map<string, Inventory> = new Map();
  
  /**
   * Create a new item
   */
  createItem(
    id: string,
    name: string,
    description: string,
    type?: 'weapon' | 'armor' | 'consumable' | 'key' | 'quest-item',
    value?: number,
    weight?: number,
    canTake?: boolean
  ): Item {
    const item: Item = {
      id,
      name,
      description,
      type,
      value,
      weight,
      canTake: canTake !== undefined ? canTake : true // Default to true if not specified
    };
    
    return item;
  }
  
  /**
   * Add an item to a player's inventory
   */
  addItemToInventory(playerId: string, item: Item): void {
    let inventory = this.inventory.get(playerId);
    
    if (!inventory) {
      inventory = { items: [] };
      this.inventory.set(playerId, inventory);
    }
    
    // Check if the item is already in inventory
    const existingItemIndex = inventory.items.findIndex(i => i.id === item.id);
    
    if (existingItemIndex === -1) {
      inventory.items.push(item);
    } else {
      // If it exists, update its properties or just leave as-is
      // For simplicity, we'll assume items are unique by ID
    }
  }
  
  /**
   * Remove an item from a player's inventory
   */
  removeItemFromInventory(playerId: string, itemId: string): boolean {
    const inventory = this.inventory.get(playerId);
    
    if (!inventory) {
      return false;
    }
    
    const initialLength = inventory.items.length;
    inventory.items = inventory.items.filter(item => item.id !== itemId);
    
    // Return true if an item was removed
    return inventory.items.length < initialLength;
  }
  
  /**
   * Get a player's inventory
   */
  getInventory(playerId: string): Inventory | undefined {
    return this.inventory.get(playerId);
  }
  
  /**
   * Check if a player has an item in their inventory
   */
  hasItem(playerId: string, itemId: string): boolean {
    const inventory = this.inventory.get(playerId);
    
    if (!inventory) {
      return false;
    }
    
    return inventory.items.some(item => item.id === itemId);
  }
}