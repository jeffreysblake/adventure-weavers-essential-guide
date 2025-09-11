import { GameSystems } from './game-systems';
import { CommandProcessor } from './command-processor';


describe('Command State Interactions Test', () => {
  let gameSystems: GameSystems;
  let commandProcessor: CommandProcessor;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
    commandProcessor = new CommandProcessor(gameSystems);
  });
  
  it('should process complex item state changes through commands', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a scenario with multiple items that change states
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
    
    const magicKey = itemSystem.createItem(
      'key-1',
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
    roomSystem.addItemToRoom('forest-1', 'tree-1');
    roomSystem.addItemToRoom('forest-1', 'vase-1');
    roomSystem.addItemToRoom('forest-1', 'door-1');
    
    // Test command processing for item interactions
    const result1 = commandProcessor.processCommand("I want to burn tree with potion");
    expect(result1.success).toBe(true);
    
    const result2 = commandProcessor.processCommand("I want to break glass vase");
    expect(result2.success).toBe(true);
    
    const result3 = commandProcessor.processCommand("I want to use key on door");
    expect(result3.success).toBe(true);
  });
  
  it('should handle complex state change scenarios', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a more complex scenario
    const caveRoom = roomSystem.createRoom(
      'cave-1',
      'Dark Cave',
      'A dark cave with glowing crystals.',
      'The cave is filled with mysterious sounds. You can see ancient runes on the walls.',
      { x: 0, y: 0 },
      { width: 30, height: 30 }
    );
    
    // Create items that change state
    const crystal = itemSystem.createItem(
      'crystal-1',
      'Glows Crystal',
      'A crystal that glows with energy.',
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
    
    const lockedChest = itemSystem.createItem(
      'chest-1',
      'Locked Chest',
      'A chest that requires a key to open.',
      'container',
      undefined,
      5, // Weight
      true,
      true, // Is container
      ['treasure-1'], // Contains treasure
      'locked', // Initial state
      200, // Health
      'key-2' // Requires key
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
    
    const key = itemSystem.createItem(
      'key-2',
      'Treasure Key',
      'A key that opens treasure chests.',
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
    roomSystem.addItemToRoom('cave-1', 'crystal-1');
    roomSystem.addItemToRoom('cave-1', 'explosive-1');
    roomSystem.addItemToRoom('cave-1', 'chest-1');
    
    // Test complex state changes
    const crystalItem = itemSystem.getItem('crystal-1');
    expect(crystalItem.state).toBe('normal');
    
    const chestItem = itemSystem.getItem('chest-1');
    expect(chestItem.state).toBe('locked');
    
    // Simulate using the explosive potion
    const result1 = itemSystem.updateItemState('crystal-1', 'shattered', 0);
    expect(result1).toBe(true);
    
    // Verify crystal state changed
    const updatedCrystal = itemSystem.getItem('crystal-1');
    expect(updatedCrystal.state).toBe('shattered');
    
    // Simulate unlocking the chest with key
    const result2 = itemSystem.updateItemState('chest-1', 'unlocked', 150);
    expect(result2).toBe(true);
    
    // Verify chest state changed
    const updatedChest = itemSystem.getItem('chest-1');
    expect(updatedChest.state).toBe('unlocked');
  });
});