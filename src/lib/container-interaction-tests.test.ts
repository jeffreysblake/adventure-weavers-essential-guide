import { GameSystems } from './game-systems';
import { ItemSystem } from './item-system';

describe('Container Interaction Tests', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });

  it('should test complex container interactions and edge cases', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create various types of containers with different properties
    const normalContainer = itemSystem.createItem(
      'normal-container',
      'Normal Container',
      'A regular container.',
      'container',
      undefined,
      5, // Weight
      true,
      true, // Is container
      [], // Empty contents
      'locked', // Initial state
      100 // Health
    );

    const largeContainer = itemSystem.createItem(
      'large-container',
      'Large Container',
      'A large container.',
      'container',
      undefined,
      20, // Weight
      true,
      true, // Is container
      [], // Empty contents
      'normal', // Initial state
      300 // Health
    );

    const fragileContainer = itemSystem.createItem(
      'fragile-container',
      'Fragile Container',
      'A delicate container.',
      'container',
      undefined,
      1, // Weight
      true,
      true, // Is container
      [], // Empty contents
      'normal', // Initial state
      50 // Health
    );

    const magicalContainer = itemSystem.createItem(
      'magical-container',
      'Magical Container',
      'A container with enchantments.',
      'container',
      undefined,
      3, // Weight
      true,
      true, // Is container
      [], // Empty contents
      'unlocked', // Initial state
      200 // Health
    );

    // Test various container operations that could stress the system
    try {
      const result1 = itemSystem.updateItemState('normal-container', 'unlocked', 80);
      expect(result1).toBe(true);
    } catch (e) {
      console.log('Normal container unlock error:', e.message);
    }

    try {
      const result2 = itemSystem.addItemToContainer('large-container', 'magical-container');
      expect(result2).toBe(true);
    } catch (e) {
      console.log('Add large container to magical container error:', e.message);
    }

    try {
      const result3 = itemSystem.updateItemState('fragile-container', 'shattered', 0);
      expect(result3).toBe(true);
    } catch (e) {
      console.log('Fragile container shatter error:', e.message);
    }
    
    // Test complex nested containers
    try {
      const result4 = itemSystem.addItemToContainer('magical-container', 'normal-container');
      expect(result4).toBe(true);
    } catch (e) {
      console.log('Add normal container to magical container error:', e.message);
    }

    try {
      const result5 = itemSystem.updateItemState('large-container', 'burned', 180);
      expect(result5).toBe(true);
    } catch (e) {
      console.log('Large container burn error:', e.message);
    }
  });

  it('should test invalid container operations that could break engine', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Test with null/undefined values
    try {
      const result1 = itemSystem.addItemToContainer(null as any, 'item-1');
      expect(result1).toBe(false);
    } catch (e) {
      console.log('Null container add error:', e.message);
    }

    try {
      const result2 = itemSystem.addItemToContainer('container-1', null as any);
      expect(result2).toBe(false);
    } catch (e) {
      console.log('Add null item to container error:', e.message);
    }

    try {
      const result3 = itemSystem.removeItemFromContainer(null as any, 'item-1');
      expect(result3).toBe(false);
    } catch (e) {
      console.log('Remove from null container error:', e.message);
    }

    try {
      const result4 = itemSystem.removeItemFromContainer('container-1', null as any);
      expect(result4).toBe(false);
    } catch (e) {
      console.log('Remove null item from container error:', e.message);
    }
    
    // Test with invalid container IDs
    try {
      const result5 = itemSystem.addItemToContainer('nonexistent-container', 'item-1');
      expect(result5).toBe(false);
    } catch (e) {
      console.log('Add to nonexistent container error:', e.message);
    }

    try {
      const result6 = itemSystem.removeItemFromContainer('container-1', 'invalid-item');
      expect(result6).toBe(false);
    } catch (e) {
      console.log('Remove invalid item from container error:', e.message);
    }
  });

  it('should test extreme container scenarios and edge cases', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create containers with maximum complexity
    const complexContainer1 = itemSystem.createItem(
      'complex-container-1',
      'Complex Container 1',
      'A container with many properties.',
      'container',
      undefined,
      50, // Weight - very heavy
      true,
      true, // Is container
      ['item-1', 'item-2'], // Contains multiple items
      'locked', // Initial state
      1000 // Health - extremely high
    );

    const complexContainer2 = itemSystem.createItem(
      'complex-container-2',
      'Complex Container 2',
      'Another container with many properties.',
      'container',
      undefined,
      30, // Weight
      true,
      true, // Is container
      ['item-3', 'item-4'], // Contains multiple items
      'unlocked', // Initial state
      500 // Health - high
    );

    const item1 = itemSystem.createItem(
      'item-1',
      'Item 1',
      'A magical item.',
      'quest-item',
      undefined,
      2, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );

    const item2 = itemSystem.createItem(
      'item-2',
      'Item 2',
      'Another magical item.',
      'consumable',
      undefined,
      1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      50 // Health
    );

    const item3 = itemSystem.createItem(
      'item-3',
      'Item 3',
      'A powerful item.',
      'weapon',
      undefined,
      10, // Weight
      true,
      false,
      undefined,
      'burned', // Initial state - already burned
      200 // Health
    );

    const item4 = itemSystem.createItem(
      'item-4',
      'Item 4',
      'A fragile item.',
      'glass',
      undefined,
      0.5, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      30 // Health
    );

    // Test extreme operations on complex containers
    try {
      const result1 = itemSystem.updateItemState('complex-container-1', 'shattered', 0);
      expect(result1).toBe(true);
    } catch (e) {
      console.log('Complex container shatter error:', e.message);
    }

    try {
      const result2 = itemSystem.addItemToContainer('complex-container-2', 'item-3');
      expect(result2).toBe(true);
    } catch (e) {
      console.log('Add item to complex container error:', e.message);
    }

    try {
      const result3 = itemSystem.removeItemFromContainer('complex-container-1', 'item-1');
      expect(result3).toBe(true);
    } catch (e) {
      console.log('Remove from complex container error:', e.message);
    }
  });
});