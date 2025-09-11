import { GameSystems } from './game-systems';

describe('Environmental State Interactions Test', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should handle environmental item state changes - fire effects', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const interactionSystem = gameSystems.getInteractionSystem();
    
    // Create a scenario with items that change due to environment
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Enchanted Forest',
      'A magical forest filled with glowing plants.',
      'The forest is alive with magic. You can see trees that glow and flowers that sparkle.',
      { x: 0, y: 0 },
      { width: 35, height: 35 }
    );
    
    // Create items
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
    
    const firePotion = itemSystem.createItem(
      'potion-1',
      'Fire Potion',
      'A potion that can set things on fire.',
      'consumable',
      undefined,
      0.2, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const explosivePotion = itemSystem.createItem(
      'explosive-1',
      'Explosive Potion',
      'A potion that explodes when disturbed.',
      'consumable',
      undefined,
      0.3, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Add items to room
    roomSystem.addItemToRoom('forest-1', 'tree-1');
    roomSystem.addItemToRoom('forest-1', 'vase-1');
    
    // Add potions to player inventory for interaction
    itemSystem.addItemToInventory('player1', firePotion);
    itemSystem.addItemToInventory('player1', explosivePotion);
    
    // Test environmental interactions that change item states
    const result1 = interactionSystem.interactWithItem('player1', 'potion-1', 'burn');
    expect(result1.success).toBe(true);
    
    const result2 = interactionSystem.interactWithItem('player1', 'explosive-1', 'explode');
    expect(result2.success).toBe(true);
    
    // Verify item states changed
    const tree = itemSystem.getItem('tree-1');
    expect(tree.state).toBe('burned');
    
    const vase = itemSystem.getItem('vase-1');
    expect(vase.state).toBe('shattered');
  });
  
  it('should handle door and container state changes', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a scenario with doors and containers
    const castleRoom = roomSystem.createRoom(
      'castle-1',
      'Castle Hall',
      'A grand hall with tall columns.',
      'The hall is filled with nobles and guards. You can see banners of different houses.',
      { x: 0, y: 0 },
      { width: 40, height: 40 }
    );
    
    // Create items
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
      'locked', // Initial state
      100, // Health
      'key-1' // Requires key
    );
    
    const treasureChest = itemSystem.createItem(
      'chest-1',
      'Treasure Chest',
      'A chest filled with gold.',
      'container',
      undefined,
      5, // Weight
      true,
      true, // Is container
      ['treasure-1'], // Contains treasure
      'locked', // Initial state
      200 // Health
    );
    
    const key = itemSystem.createItem(
      'key-1',
      'Golden Key',
      'A key that unlocks magical doors.',
      'key',
      undefined,
      0.1, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
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
    
    // Add items to room
    roomSystem.addItemToRoom('castle-1', 'door-1');
    roomSystem.addItemToRoom('castle-1', 'chest-1');
    
    // Test state changes
    const door = itemSystem.getItem('door-1');
    expect(door.state).toBe('locked');
    
    const chest = itemSystem.getItem('chest-1');
    expect(chest.state).toBe('locked');
    
    // Simulate unlocking the door
    const result1 = itemSystem.updateItemState('door-1', 'unlocked', 85);
    expect(result1).toBe(true);
    
    // Simulate opening the chest (container)
    const result2 = itemSystem.updateItemState('chest-1', 'normal', 150);
    expect(result2).toBe(true);
    
    // Verify states changed
    const updatedDoor = itemSystem.getItem('door-1');
    expect(updatedDoor.state).toBe('unlocked');
    
    const updatedChest = itemSystem.getItem('chest-1');
    expect(updatedChest.state).toBe('normal');
  });
  
  it('should handle complex environmental effects', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a scenario with multiple environmental effects
    const laboratory = roomSystem.createRoom(
      'lab-1',
      'Magic Laboratory',
      'A large room filled with bubbling potions and floating crystals.',
      'The laboratory is filled with magical experiments. You can see glowing chemicals in beakers.',
      { x: 0, y: 0 },
      { width: 45, height: 45 }
    );
    
    // Create items
    const levitatingCrystal = itemSystem.createItem(
      'crystal-1',
      'Levitating Crystal',
      'A crystal that floats in mid-air.',
      'glass',
      undefined,
      0.5, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const explosivePotion = itemSystem.createItem(
      'explosive-2',
      'Explosive Potion',
      'A potion that explodes when disturbed.',
      'consumable',
      undefined,
      0.3, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    const firePotion = itemSystem.createItem(
      'fire-1',
      'Fire Potion',
      'A potion that can set things on fire.',
      'consumable',
      undefined,
      0.2, // Light weight
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
      0.1, // Light weight
      true,
      false,
      undefined,
      'normal', // Initial state
      100 // Health
    );
    
    // Add items to room
    roomSystem.addItemToRoom('lab-1', 'crystal-1');
    
    // Test complex environmental interactions
    const crystal = itemSystem.getItem('crystal-1');
    expect(crystal.state).toBe('normal');
    
    // Simulate breaking the crystal with explosion
    const result1 = itemSystem.updateItemState('crystal-1', 'shattered', 0);
    expect(result1).toBe(true);
    
    const updatedCrystal = itemSystem.getItem('crystal-1');
    expect(updatedCrystal.state).toBe('shattered');
    
    // Simulate using fire potion
    const result2 = itemSystem.updateItemState('fire-1', 'burned', 0);
    expect(result2).toBe(true);
  });
});