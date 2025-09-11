import { ItemSystem } from './item-system';
import { RoomSystem } from './room-system';
import { PlayerInteractionSystem } from './player-interaction';


describe('PlayerInteractionSystem', () => {
  let itemSystem: ItemSystem;
  let roomSystem: RoomSystem;
  let interactionSystem: PlayerInteractionSystem;
  
  beforeEach(() => {
    itemSystem = new ItemSystem();
    roomSystem = new RoomSystem();
    interactionSystem = new PlayerInteractionSystem(itemSystem, roomSystem);
  });
  
  it('should use a consumable item correctly', () => {
    // Create a fireball potion
    const potion = itemSystem.createItem(
      'potion-1',
      'Fireball Potion',
      'A glowing potion that explodes when thrown',
      'consumable'
    );
    
    // Add it to inventory
    itemSystem.addItemToInventory('player1', potion);
    
    // Use the potion
    const result = interactionSystem.useItem('player1', 'potion-1');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('fireball');
  });
  
  it('should handle opening a container correctly', () => {
    // Create a treasure chest
    const chest = itemSystem.createItem(
      'chest-1',
      'Treasure Chest',
      'A wooden chest with a lock',
      'container',
      undefined,
      undefined,
      true,
      true
    );
    
    // Create an item to put inside the container
    const sword = itemSystem.createItem(
      'sword-1',
      'Sword of Light',
      'A magical sword'
    );
    
    // Add items to inventory
    itemSystem.addItemToInventory('player1', chest);
    itemSystem.addItemToInventory('player1', sword);
    
    // Add sword to the chest (container)
    expect(itemSystem.addItemToContainer('chest-1', 'sword-1')).toBe(true);
    
    // Open container
    const result = interactionSystem.openContainer('player1', 'chest-1');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('open');
  });
});