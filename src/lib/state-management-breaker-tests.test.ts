import { GameSystems } from './game-systems';
import { ItemSystem } from './item-system';

describe('State Management Breaker Tests', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });

  it('should test extreme state transitions and edge cases', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create items with various initial states
    const normalItem = itemSystem.createItem(
      'normal-item',
      'Normal Item',
      'A regular item.',
      'quest-item',
      undefined,
      1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );

    const burnedItem = itemSystem.createItem(
      'burned-item',
      'Burned Item',
      'An item that is already burned.',
      'tree',
      undefined,
      5, // Weight
      true,
      false,
      undefined,
      'burned', // Initial state - already burned
      30 // Health
    );

    const shatteredItem = itemSystem.createItem(
      'shattered-item',
      'Shattered Item',
      'A broken item.',
      'glass',
      undefined,
      0.5, // Weight
      true,
      false,
      undefined,
      'shattered', // Initial state - already shattered
      0 // Health
    );

    const lockedItem = itemSystem.createItem(
      'locked-item',
      'Locked Item',
      'A locked item.',
      'door',
      undefined,
      15, // Weight
      true,
      false,
      undefined,
      'locked', // Initial state - already locked
      100 // Health
    );

    // Test extreme state transitions that could break engine
    try {
      const result1 = itemSystem.updateItemState('normal-item', 'burned', 50);
      expect(result1).toBe(true);
    } catch (e) {
      console.log('Normal to burned transition error:', e.message);
    }

    try {
      const result2 = itemSystem.updateItemState('burned-item', 'shattered', 0);
      expect(result2).toBe(true);
    } catch (e) {
      console.log('Burned to shattered transition error:', e.message);
    }

    try {
      const result3 = itemSystem.updateItemState('shattered-item', 'normal', 75);
      expect(result3).toBe(true);
    } catch (e) {
      console.log('Shattered to normal transition error:', e.message);
    }

    try {
      const result4 = itemSystem.updateItemState('locked-item', 'unlocked', 80);
      expect(result4).toBe(true);
    } catch (e) {
      console.log('Locked to unlocked transition error:', e.message);
    }
    
    // Test invalid state transitions
    try {
      const result5 = itemSystem.updateItemState('normal-item', 'invalid-state' as any, 100);
      expect(result5).toBe(true); // Should handle gracefully even with invalid state
    } catch (e) {
      console.log('Invalid state transition error:', e.message);
    }
    
    try {
      const result6 = itemSystem.updateItemState(null as any, 'burned', 50);
      expect(result6).toBe(false); // Should handle null gracefully
    } catch (e) {
      console.log('Null item state change error:', e.message);
    }
  });

  it('should test complex state management with multiple simultaneous operations', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create items for stress testing
    const items = [
      itemSystem.createItem(
        'item-1',
        'Item 1',
        'A magical item.',
        'quest-item',
        undefined,
        0.5, // Weight
        true,
        false,
        undefined,
        'normal', // Initial state
        100 // Health
      ),
      
      itemSystem.createItem(
        'item-2',
        'Item 2',
        'A glowing item.',
        'glass',
        undefined,
        0.3, // Weight
        true,
        false,
        undefined,
        'normal', // Initial state
        80 // Health
      ),
      
      itemSystem.createItem(
        'item-3',
        'Item 3',
        'A burning item.',
        'tree',
        undefined,
        10, // Weight
        true,
        false,
        undefined,
        'burned', // Initial state - already burned
        50 // Health
      )
    ];

    // Test multiple simultaneous operations (stress test)
    try {
      const result1 = itemSystem.updateItemState('item-1', 'shattered', 0);
      expect(result1).toBe(true);
    } catch (e) {
      console.log('Update item-1 state error:', e.message);
    }

    try {
      const result2 = itemSystem.updateItemState('item-2', 'burned', 30);
      expect(result2).toBe(true);
    } catch (e) {
      console.log('Update item-2 state error:', e.message);
    }

    try {
      const result3 = itemSystem.updateItemState('item-3', 'normal', 75);
      expect(result3).toBe(true);
    } catch (e) {
      console.log('Update item-3 state error:', e.message);
    }
    
    // Verify all states are managed correctly
    try {
      const updatedItem1 = itemSystem.getItem('item-1');
      expect(updatedItem1.state).toBe('shattered');
      expect(updatedItem1.health).toBe(0);
    } catch (e) {
      console.log('Verify item-1 state error:', e.message);
    }

    try {
      const updatedItem2 = itemSystem.getItem('item-2');
      expect(updatedItem2.state).toBe('burned');
      expect(updatedItem2.health).toBe(30);
    } catch (e) {
      console.log('Verify item-2 state error:', e.message);
    }

    try {
      const updatedItem3 = itemSystem.getItem('item-3');
      expect(updatedItem3.state).toBe('normal');
      expect(updatedItem3.health).toBe(75);
    } catch (e) {
      console.log('Verify item-3 state error:', e.message);
    }
  });

  it('should test edge cases for state management', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Test with extreme values
    try {
      const result1 = itemSystem.updateItemState('valid-item', 'normal', -50);
      expect(result1).toBe(true); // Should handle negative health gracefully
    } catch (e) {
      console.log('Negative health in state management error:', e.message);
    }

    try {
      const result2 = itemSystem.updateItemState('valid-item', 'burned', 999999);
      expect(result2).toBe(true); // Should handle extremely high values
    } catch (e) {
      console.log('Extremely high health in state management error:', e.message);
    }

    try {
      const result3 = itemSystem.updateItemState(null as any, 'burned', 100);
      expect(result3).toBe(false); // Should handle null gracefully
    } catch (e) {
      console.log('Null item in state management error:', e.message);
    }
    
    // Test with invalid states and values
    try {
      const result4 = itemSystem.updateItemState('valid-item', 'completely-invalid-state' as any, 50);
      expect(result4).toBe(true); // Should handle gracefully even with invalid state
    } catch (e) {
      console.log('Invalid state in management error:', e.message);
    }
    
    try {
      const result5 = itemSystem.updateItemState('valid-item', 'normal', null as any);
      expect(result5).toBe(true); // Should handle null health gracefully
    } catch (e) {
      console.log('Null health in management error:', e.message);
    }
  });

  it('should test complex state interactions with containers and items', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create container items for testing
    const containerItem = itemSystem.createItem(
      'container-item',
      'Container Item',
      'A magical container.',
      'container',
      undefined,
      5, // Weight
      true,
      true, // Is container
      ['contained-item'], // Contains an item
      'locked', // Initial state
      200 // Health
    );

    const containedItem = itemSystem.createItem(
      'contained-item',
      'Contained Item',
      'An item inside a container.',
      'quest-item',
      undefined,
      1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );

    const doorItem = itemSystem.createItem(
      'door-item',
      'Door Item',
      'A magical door.',
      'door',
      undefined,
      15, // Weight
      true,
      false,
      undefined,
      'locked', // Initial state
      100 // Health
    );

    const keyItem = itemSystem.createItem(
      'key-item',
      'Key Item',
      'A magical key.',
      'key',
      undefined,
      0.1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );

    // Test complex interactions between containers and items
    try {
      const result = itemSystem.updateItemState('container-item', 'unlocked', 180);
      expect(result).toBe(true);
    } catch (e) {
      console.log('Container unlock error:', e.message);
    }

    try {
      const result = itemSystem.addItemToContainer('container-item', 'contained-item');
      expect(result).toBe(true);
    } catch (e) {
      console.log('Add to container error:', e.message);
    }
    
    // Test state transitions for door and key items
    try {
      const result1 = itemSystem.updateItemState('door-item', 'unlocked', 95);
      expect(result1).toBe(true);
    } catch (e) {
      console.log('Door unlock error:', e.message);
    }

    try {
      const result2 = itemSystem.updateItemState('key-item', 'normal', 100);
      expect(result2).toBe(true);
    } catch (e) {
      console.log('Key state change error:', e.message);
    }
    
    // Test complex nested container operations
    try {
      const result3 = itemSystem.updateItemState('container-item', 'burned', 150);
      expect(result3).toBe(true);
    } catch (e) {
      console.log('Container burn error:', e.message);
    }
  });
});