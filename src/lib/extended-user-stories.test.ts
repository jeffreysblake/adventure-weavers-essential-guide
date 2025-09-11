import { GameSystems } from './game-systems';



describe('Extended User Stories Test', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should support multiple user story scenarios', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Scenario 1: Treasure hunt in a castle
    const castleRoom = roomSystem.createRoom(
      'castle-1',
      'Castle Hall',
      'A grand hall with high ceilings and tapestries.',
      'The castle is filled with secrets. You can see a locked chest behind a large tapestry.',
      { x: 0, y: 0 },
      { width: 30, height: 20 }
    );
    
    const treasureChest = itemSystem.createItem(
      'chest-2',
      'Locked Chest',
      'A chest with a complex lock',
      'container',
      undefined,
      undefined,
      true,
      true
    );
    
    // Add items to room
    roomSystem.addItemToRoom('castle-1', 'chest-2');
    
    // Scenario 2: Cave exploration with puzzles
    const caveRoom = roomSystem.createRoom(
      'cave-1',
      'Dark Cave',
      'A narrow cave with glowing crystals.',
      'The cave is filled with mysterious crystals that seem to pulse with energy.',
      { x: 0, y: 30 },
      { width: 20, height: 15 }
    );
    
    const crystal = itemSystem.createItem(
      'crystal-1',
      'Glowing Crystal',
      'A crystal that pulses with energy'
    );
    
    roomSystem.addItemToRoom('cave-1', 'crystal-1');
    
    // Scenario 3: Forest puzzle
    const forestRoom = roomSystem.createRoom(
      'forest-2',
      'Enchanted Forest',
      'A magical forest with talking trees.',
      'The forest is alive with magic. You can hear whispers in the wind.',
      { x: 30, y: 30 },
      { width: 25, height: 15 }
    );
    
    // Connect scenarios
    roomSystem.addConnection('castle-1', 'cave-1', 'south');
    roomSystem.addConnection('cave-1', 'forest-2', 'east');
    
    // Verify all rooms were created correctly
    expect(roomSystem.getRoom('castle-1')).toBeDefined();
    expect(roomSystem.getRoom('cave-1')).toBeDefined();
    expect(roomSystem.getRoom('forest-2')).toBeDefined();
    
    // Verify room connections work properly
    const castle = roomSystem.getRoom('castle-1');
    const cave = roomSystem.getRoom('cave-1');
    
    expect(castle.connections.south).toBeDefined();
    expect(cave.connections.east).toBeDefined();
  });
  
  it('should handle complex item interactions', () => {
    const itemSystem = gameSystems.getItemSystem();
    
    // Create multiple types of items
    const sword = itemSystem.createItem(
      'sword-1',
      'Iron Sword',
      'A sharp iron sword'
    );
    
    const potion = itemSystem.createItem(
      'potion-1',
      'Health Potion',
      'A healing potion'
    );
    
    const key = itemSystem.createItem(
      'key-1',
      'Golden Key',
      'A key that unlocks magical doors'
    );
    
    // Verify items were created correctly
    expect(sword.id).toBe('sword-1');
    expect(potion.id).toBe('potion-1');
    expect(key.id).toBe('key-1');
  });
});