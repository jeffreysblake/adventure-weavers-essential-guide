import { ItemSystem } from './item-system';
import { InventorySystem } from './inventory-system';


describe('InventorySystem', () => {
  let itemSystem: ItemSystem;
  let inventorySystem: InventorySystem;
  
  beforeEach(() => {
    itemSystem = new ItemSystem();
    inventorySystem = new InventorySystem(itemSystem);
  });
  
  it('should initialize a player\'s inventory', () => {
    inventorySystem.initializePlayerInventory('player1');
    
    const slots = inventorySystem.getPlayerInventory('player1');
    expect(slots).toEqual([]);
  });
  
  it('should add an item to inventory', () => {
    inventorySystem.initializePlayerInventory('player1');
    
    // Create an item
    const sword = itemSystem.createItem(
      'sword-1',
      'Sword of Light',
      'A magical sword'
    );
    
    // Add to inventory
    expect(inventorySystem.addItemToInventory('player1', 'sword-1')).toBe(true);
    
    const slots = inventorySystem.getPlayerInventory('player1');
    expect(slots.length).toBe(1);
    expect(slots[0].itemId).toBe('sword-1');
    expect(slots[0].quantity).toBe(1);
  });
  
  it('should handle multiple quantities of items', () => {
    inventorySystem.initializePlayerInventory('player1');
    
    // Add same item twice
    expect(inventorySystem.addItemToInventory('player1', 'sword-1')).toBe(true);
    expect(inventorySystem.addItemToInventory('player1', 'sword-1')).toBe(true);
    
    const slots = inventorySystem.getPlayerInventory('player1');
    expect(slots.length).toBe(1);
    expect(slots[0].quantity).toBe(2);
  });
  
  it('should remove an item from inventory', () => {
    inventorySystem.initializePlayerInventory('player1');
    
    // Add an item
    expect(inventorySystem.addItemToInventory('player1', 'sword-1')).toBe(true);
    
    // Remove the item
    expect(inventorySystem.removeItemFromInventory('player1', 'sword-1')).toBe(true);
    
    const slots = inventorySystem.getPlayerInventory('player1');
    expect(slots.length).toBe(0);
  });
});