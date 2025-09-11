import { ItemSystem } from './item-system';
import { RoomSystem } from './room-system';
import { EnvironmentalInteractionsSystem } from './environmental-interactions';



describe('EnvironmentalInteractionsSystem', () => {
  let itemSystem: ItemSystem;
  let roomSystem: RoomSystem;
  let environmentalSystem: EnvironmentalInteractionsSystem;
  
  beforeEach(() => {
    itemSystem = new ItemSystem();
    roomSystem = new RoomSystem();
    environmentalSystem = new EnvironmentalInteractionsSystem(itemSystem, roomSystem);
  });
  
  it('should handle throwing a fireball potion at environment', () => {
    // Create an item
    const potion = itemSystem.createItem(
      'potion-1',
      'Fireball Potion',
      'A glowing potion that explodes when thrown'
    );
    
    // Add to player's inventory
    itemSystem.addItemToInventory('player1', potion);
    
    // Try to throw the potion at environment
    const result = environmentalSystem.throwAtEnvironment('player1', 'potion-1');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('fireball');
    if (result.environmentalEffect) {
      expect(result.environmentalEffect.type).toBe('fireball');
      expect(result.environmentalEffect.intensity).toBe(85);
    }
  });
});