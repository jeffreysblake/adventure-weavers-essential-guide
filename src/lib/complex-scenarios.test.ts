import { GameSystems } from './game-systems';



describe('Complex Scenarios Test', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should handle a multi-part quest with branching paths', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create a complex scenario with multiple branches
    const entranceRoom = roomSystem.createRoom(
      'entrance-1',
      'Castle Entrance',
      'A grand castle entrance with tall columns.',
      'The entrance is filled with nobles and guards. You can see banners of different houses.',
      { x: 0, y: 0 },
      { width: 30, height: 25 }
    );
    
    const hallwayRoom = roomSystem.createRoom(
      'hallway-1',
      'Grand Hallway',
      'A long hallway with tapestries on the walls.',
      'The hallway is filled with mysterious sounds. You can see doors leading to different rooms.',
      { x: 30, y: 0 },
      { width: 25, height: 25 }
    );
    
    const libraryRoom = roomSystem.createRoom(
      'library-1',
      'Ancient Library',
      'A vast library with tall bookshelves.',
      'The library is filled with ancient texts. You can see scrolls and books everywhere.',
      { x: 55, y: 0 },
      { width: 30, height: 30 }
    );
    
    const armoryRoom = roomSystem.createRoom(
      'armory-1',
      'Weapons Armory',
      'A large room filled with weapons.',
      'The room is filled with swords and shields. You can see armor racks everywhere.',
      { x: 55, y: 30 },
      { width: 30, height: 30 }
    );
    
    const treasureRoom = roomSystem.createRoom(
      'treasure-1',
      'Treasure Vault',
      'A secret vault filled with gold.',
      'The vault is filled with glittering treasures. You can see chests of different sizes.',
      { x: 85, y: 0 },
      { width: 25, height: 30 }
    );
    
    // Create items
    const sword = itemSystem.createItem(
      'sword-1',
      'Royal Sword',
      'A legendary blade'
    );
    
    
    const key = itemSystem.createItem(
      'key-1',
      'Treasure Key',
      'A key that unlocks the treasure vault'
    );
    
    // Connect rooms in a branching path
    roomSystem.addConnection('entrance-1', 'hallway-1', 'east');
    roomSystem.addConnection('hallway-1', 'library-1', 'south');
    roomSystem.addConnection('hallway-1', 'armory-1', 'north');
    roomSystem.addConnection('library-1', 'treasure-1', 'east');
    
    // Verify complex setup works
    expect(roomSystem.getRoom('entrance-1').name).toBe('Castle Entrance');
    expect(roomSystem.getRoom('hallway-1').connections.south).toBeDefined();
  });
  
  it('should handle a time-based puzzle quest', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create rooms for a time-based puzzle
    const clockTowerRoom = roomSystem.createRoom(
      'clocktower-1',
      'Clock Tower',
      'A tall tower with a large clock.',
      'The tower is filled with the sound of ticking clocks. You can see gears turning in the background.',
      { x: 0, y: 0 },
      { width: 25, height: 35 }
    );
    
    const puzzleRoom = roomSystem.createRoom(
      'puzzle-1',
      'Puzzle Room',
      'A mysterious room with strange symbols.',
      'The room is filled with ancient puzzles. You can see a large clock face on the wall.',
      { x: 25, y: 0 },
      { width: 30, height: 30 }
    );
    
    const treasureRoom = roomSystem.createRoom(
      'treasure-1',
      'Treasure Room',
      'A secret chamber with glittering treasures.',
      'The room is filled with gold and jewels. You can see a chest in the center.',
      { x: 55, y: 0 },
      { width: 30, height: 30 }
    );
    
    // Create time-based items
    const hourglass = itemSystem.createItem(
      'hourglass-1',
      'Magic Hourglass',
      'A magical hourglass that controls time'
    );
    
    const key = itemSystem.createItem(
      'key-2',
      'Time Key',
      'A key that opens the treasure room'
    );
    
    // Connect rooms
    roomSystem.addConnection('clocktower-1', 'puzzle-1', 'east');
    roomSystem.addConnection('puzzle-1', 'treasure-1', 'east');
    
    // Verify setup works correctly
    expect(roomSystem.getRoom('clocktower-1').name).toBe('Clock Tower');
    expect(itemSystem.getItem('hourglass-1').name).toBe('Magic Hourglass');
  });
});