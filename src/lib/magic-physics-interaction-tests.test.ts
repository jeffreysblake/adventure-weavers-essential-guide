import { GameSystems } from './game-systems';

describe('Magic Physics Interaction Tests', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should test physics/magic state interactions - burning trees', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a magical forest environment
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Enchanted Forest',
      'A magical forest filled with glowing plants.',
      'The forest is alive with magic. You can see trees that glow and flowers that sparkle.',
      { x: 0, y: 0 },
      { width: 40, height: 40 }
    );
    
    // Create a tree that can be burned
    const burningTree = itemSystem.createItem(
      'tree-1',
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
    
    const firePotion = itemSystem.createItem(
      'potion-1',
      'Fire Potion',
      'A potion that can set things on fire.',
      'consumable',
      undefined,
      0.2, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const magicKey = itemSystem.createItem(
      'key-1',
      'Magic Key',
      'A key that can unlock magical doors.',
      'key',
      undefined,
      0.1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Add items to room
    roomSystem.addItemToRoom('forest-1', 'tree-1');
    roomSystem.addItemToRoom('forest-1', 'potion-1');
    
    // Test physics/magic interaction - burning tree with potion
    const result = itemSystem.updateItemState('tree-1', 'burned', 20);
    expect(result).toBe(true);
    
    // Verify state change
    const updatedTree = itemSystem.getItem('tree-1');
    expect(updatedTree.state).toBe('burned');
    expect(updatedTree.health).toBe(20);
  });
  
  it('should test physics/magic interactions - breaking glass', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a magical laboratory environment
    const labRoom = roomSystem.createRoom(
      'lab-1',
      'Magic Laboratory',
      'A large room filled with bubbling potions and floating crystals.',
      'The laboratory is filled with magical experiments. You can see glowing chemicals in beakers.',
      { x: 0, y: 0 },
      { width: 45, height: 45 }
    );
    
    // Create a glass item that can shatter
    const shatteredGlass = itemSystem.createItem(
      'glass-1',
      'Magic Glass',
      'A fragile piece of magical glass.',
      'glass',
      undefined,
      0.5, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      50 // Health
    );
    
    const explosivePotion = itemSystem.createItem(
      'explosive-1',
      'Explosive Potion',
      'A potion that explodes when disturbed.',
      'consumable',
      undefined,
      0.3, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const magicKey = itemSystem.createItem(
      'key-2',
      'Magic Key',
      'A key that can unlock magical doors.',
      'key',
      undefined,
      0.1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Add items to room
    roomSystem.addItemToRoom('lab-1', 'glass-1');
    roomSystem.addItemToRoom('lab-1', 'explosive-1');
    
    // Test physics/magic interaction - breaking glass with explosion
    const result = itemSystem.updateItemState('glass-1', 'shattered', 0);
    expect(result).toBe(true);
    
    // Verify state change
    const updatedGlass = itemSystem.getItem('glass-1');
    expect(updatedGlass.state).toBe('shattered');
    expect(updatedGlass.health).toBe(0);
  });
  
  it('should test complex physics/magic interactions - door unlocking', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a magical castle environment
    const castleRoom = roomSystem.createRoom(
      'castle-1',
      'Magical Castle',
      'A grand hall with tall columns.',
      'The castle is filled with nobles and guards. You can see banners of different houses.',
      { x: 0, y: 0 },
      { width: 50, height: 50 }
    );
    
    // Create a locked door
    const lockedDoor = itemSystem.createItem(
      'door-1',
      'Locked Door',
      'A door that requires a key to open.',
      'door',
      undefined,
      15, // Weight
      true,
      false,
      undefined,
      'locked', // Initial state - already locked
      100, // Health
      'key-3' // Requires key
    );
    
    const magicKey = itemSystem.createItem(
      'key-3',
      'Treasure Key',
      'A key that unlocks treasure chests.',
      'key',
      undefined,
      0.1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const firePotion = itemSystem.createItem(
      'potion-2',
      'Fire Potion',
      'A potion that can set things on fire.',
      'consumable',
      undefined,
      0.2, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Add items to room
    roomSystem.addItemToRoom('castle-1', 'door-1');
    roomSystem.addItemToRoom('castle-1', 'key-3');
    
    // Test physics/magic interaction - unlocking door with key
    const result = itemSystem.updateItemState('door-1', 'unlocked', 85);
    expect(result).toBe(true);
    
    // Verify state change
    const updatedDoor = itemSystem.getItem('door-1');
    expect(updatedDoor.state).toBe('unlocked');
    expect(updatedDoor.health).toBe(85);
  });
  
  it('should test complex physics/magic interactions with containers', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a magical treasure room
    const treasureRoom = roomSystem.createRoom(
      'treasure-1',
      'Treasure Room',
      'A secret vault filled with gold.',
      'The room is filled with glittering treasures. You can see chests of different sizes.',
      { x: 0, y: 0 },
      { width: 40, height: 40 }
    );
    
    // Create a treasure chest
    const treasureChest = itemSystem.createItem(
      'chest-1',
      'Treasure Chest',
      'A wooden chest with a lock.',
      'container',
      undefined,
      5, // Weight
      true,
      true, // Is container
      ['treasure-1'], // Contains treasure
      'locked', // Initial state - already locked
      200 // Health
    );
    
    const treasure = itemSystem.createItem(
      'treasure-1',
      'Treasure',
      'A pile of gold and jewels.',
      'quest-item',
      500, // Value
      2, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const magicKey = itemSystem.createItem(
      'key-4',
      'Golden Key',
      'A key that unlocks treasure chests.',
      'key',
      undefined,
      0.1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const firePotion = itemSystem.createItem(
      'potion-3',
      'Fire Potion',
      'A potion that can set things on fire.',
      'consumable',
      undefined,
      0.2, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Add items to room
    roomSystem.addItemToRoom('treasure-1', 'chest-1');
    roomSystem.addItemToRoom('treasure-1', 'key-4');
    
    // Test complex physics/magic interaction - opening chest with key
    const result = itemSystem.updateItemState('chest-1', 'unlocked', 180);
    expect(result).toBe(true);
    
    // Verify state change
    const updatedChest = itemSystem.getItem('chest-1');
    expect(updatedChest.state).toBe('unlocked');
    expect(updatedChest.health).toBe(180);
  });
  
  it('should test physics/magic interactions with multiple simultaneous effects', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a complex magical environment
    const complexRoom = roomSystem.createRoom(
      'complex-1',
      'Complex Magical Room',
      'A room filled with multiple interacting elements.',
      'The room is full of magical items. You can see containers, doors, and consumables.',
      { x: 0, y: 0 },
      { width: 50, height: 50 }
    );
    
    // Create multiple items with different physics/magic properties
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
    
    const shatteredGlass = itemSystem.createItem(
      'glass-2',
      'Shattered Glass',
      'A piece of broken glass.',
      'glass',
      undefined,
      0.5, // Weight
      true,
      false,
      undefined,
      'shattered', // Initial state - already shattered
      0 // Health
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
      'locked', // Initial state - already locked
      100, // Health
      'key-5' // Requires key
    );
    
    const magicKey = itemSystem.createItem(
      'key-5',
      'Magic Key',
      'A key that can unlock magical doors.',
      'key',
      undefined,
      0.1, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const firePotion = itemSystem.createItem(
      'potion-4',
      'Fire Potion',
      'A potion that can set things on fire.',
      'consumable',
      undefined,
      0.2, // Weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Add items to room
    roomSystem.addItemToRoom('complex-1', 'tree-2');
    roomSystem.addItemToRoom('complex-1', 'glass-2');
    roomSystem.addItemToRoom('complex-1', 'door-2');
    
    // Test multiple simultaneous physics/magic interactions (stress test)
    const result1 = itemSystem.updateItemState('tree-2', 'normal', 75);
    expect(result1).toBe(true);
    
    const result2 = itemSystem.updateItemState('glass-2', 'burned', 40);
    expect(result2).toBe(true);
    
    const result3 = itemSystem.updateItemState('door-2', 'unlocked', 85);
    expect(result3).toBe(true);
    
    // Verify all state changes are persisted correctly
    const updatedTree = itemSystem.getItem('tree-2');
    expect(updatedTree.state).toBe('normal');
    expect(updatedTree.health).toBe(75);
    
    const updatedGlass = itemSystem.getItem('glass-2');
    expect(updatedGlass.state).toBe('burned');
    expect(updatedGlass.health).toBe(40);
    
    const updatedDoor = itemSystem.getItem('door-2');
    expect(updatedDoor.state).toBe('unlocked');
    expect(updatedDoor.health).toBe(85);
  });
});