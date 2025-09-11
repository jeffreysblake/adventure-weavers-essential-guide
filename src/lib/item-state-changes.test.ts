import { GameSystems } from './game-systems';

describe('Item State Changes Test', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should handle burning tree state changes', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a tree that can be burned
    const treeItem = itemSystem.createItem(
      'tree-1',
      'Oak Tree',
      'A large oak tree with thick bark.',
      'tree',
      undefined,
      undefined,
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Verify initial state
    expect(treeItem.state).toBe('normal');
    expect(treeItem.health).toBe(100);
    
    // Simulate burning the tree (using an item interaction)
    const result = itemSystem.updateItemState('tree-1', 'burned', 30);
    
    // Verify state change
    expect(result).toBe(true);
    
    const updatedTree = itemSystem.getItem('tree-1');
    expect(updatedTree.state).toBe('burned');
    expect(updatedTree.health).toBe(30);
  });
  
  it('should handle door unlocking state changes', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a locked door
    const doorItem = itemSystem.createItem(
      'door-1',
      'Iron Door',
      'A heavy iron door with a lock.',
      'door',
      undefined,
      undefined,
      true,
      false,
      undefined,
      'locked', // Initial state
      100, // Health
      'key-1' // Requires key to unlock
    );
    
    // Verify initial state
    expect(doorItem.state).toBe('locked');
    expect(doorItem.requiresKey).toBe('key-1');
    
    // Simulate unlocking the door (using a key)
    const result = itemSystem.updateItemState('door-1', 'unlocked', 80);
    
    // Verify state change
    expect(result).toBe(true);
    
    const updatedDoor = itemSystem.getItem('door-1');
    expect(updatedDoor.state).toBe('unlocked');
    expect(updatedDoor.health).toBe(80);
  });
  
  it('should handle glass breaking state changes', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a glass object that can shatter
    const glassItem = itemSystem.createItem(
      'glass-1',
      'Magic Glass',
      'A fragile piece of magical glass.',
      'glass',
      undefined,
      0.5, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      50 // Health
    );
    
    // Verify initial state
    expect(glassItem.state).toBe('normal');
    expect(glassItem.health).toBe(50);
    
    // Simulate breaking the glass (using an interaction)
    const result = itemSystem.updateItemState('glass-1', 'shattered', 0);
    
    // Verify state change
    expect(result).toBe(true);
    
    const updatedGlass = itemSystem.getItem('glass-1');
    expect(updatedGlass.state).toBe('shattered');
    expect(updatedGlass.health).toBe(0);
  });
  
  it('should handle container state changes', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a treasure chest
    const chestItem = itemSystem.createItem(
      'chest-1',
      'Treasure Chest',
      'A wooden chest with a lock.',
      'container',
      undefined,
      5, // Weight
      true,
      true, // Is container
      ['potion-1'], // Contains items
      'normal', // Initial state
      100 // Health
    );
    
    // Verify initial state
    expect(chestItem.isContainer).toBe(true);
    expect(chestItem.state).toBe('normal');
    expect(chestItem.containedItems).toContain('potion-1');
    
    // Simulate opening the chest (using an interaction)
    const result = itemSystem.updateItemState('chest-1', 'burned', 50);
    
    // Verify state change
    expect(result).toBe(true);
    
    const updatedChest = itemSystem.getItem('chest-1');
    expect(updatedChest.state).toBe('burned');
    expect(updatedChest.health).toBe(50);
  });
  
  it('should handle complex interaction scenarios', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Create a scenario with multiple state changes
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Enchanted Forest',
      'A magical forest filled with glowing plants.',
      'The forest is alive with magic. You can see trees that glow and flowers that sparkle.',
      { x: 0, y: 0 },
      { width: 30, height: 30 }
    );
    
    // Create items
    const burningTree = itemSystem.createItem(
      'tree-2',
      'Burning Tree',
      'A tree that is on fire.',
      'tree',
      undefined,
      10, // Weight
      true,
      false,
      undefined,
      'burned', // Initial state - already burned
      30 // Health
    );
    
    const glassVase = itemSystem.createItem(
      'vase-1',
      'Magic Glass Vase',
      'A vase made of fragile magic glass.',
      'glass',
      undefined,
      0.5, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      50 // Health
    );
    
    const lockedDoor = itemSystem.createItem(
      'door-2',
      'Locked Door',
      'A door that requires a key to open.',
      'door',
      undefined,
      15, // Weight
      true,
      false,
      undefined,
      'locked', // Initial state
      100, // Health
      'key-2' // Requires key
    );
    
    // Add items to room
    roomSystem.addItemToRoom('forest-1', 'tree-2');
    roomSystem.addItemToRoom('forest-1', 'vase-1');
    roomSystem.addItemToRoom('forest-1', 'door-2');
    
    // Verify all items were created with correct initial states
    expect(itemSystem.getItem('tree-2')).toBeDefined();
    expect(itemSystem.getItem('vase-1')).toBeDefined();
    expect(itemSystem.getItem('door-2')).toBeDefined();
    
    // Test state changes in the environment
    const tree = itemSystem.getItem('tree-2');
    expect(tree.state).toBe('burned');
    
    const vase = itemSystem.getItem('vase-1');
    expect(vase.state).toBe('normal');
    
    // Simulate breaking the glass
    const breakResult = itemSystem.updateItemState('vase-1', 'shattered', 0);
    expect(breakResult).toBe(true);
    
    const updatedVase = itemSystem.getItem('vase-1');
    expect(updatedVase.state).toBe('shattered');
    expect(updatedVase.health).toBe(0);
    
    // Simulate unlocking the door
    const unlockResult = itemSystem.updateItemState('door-2', 'unlocked', 85);
    expect(unlockResult).toBe(true);
    
    const updatedDoor = itemSystem.getItem('door-2');
    expect(updatedDoor.state).toBe('unlocked');
    expect(updatedDoor.health).toBe(85);
  });
});