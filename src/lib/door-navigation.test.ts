import { GameSystems } from './game-systems';

describe('Door Navigation Test', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should properly handle small door navigation and crawling', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Create rooms with a very small door
    const cabinRoom = roomSystem.createRoom(
      'cabin-1',
      'Small Cabin',
      'A cramped wooden cabin.',
      'The cabin is tiny, but you can see a very small door leading to another area.',
      { x: 0, y: 0 },
      { width: 10, height: 10 }
    );
    
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Dark Forest',
      'A mysterious forest with glowing plants.',
      'The forest is filled with strange sounds and movements.',
      { x: 10, y: 0 },
      { width: 20, height: 20 }
    );
    
    // Add a connection that represents the small door
    roomSystem.addConnection('cabin-1', 'forest-1', 'east', false, undefined, true, true);
    
    // Create player
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'cabin-1'
    );
    
    // Verify initial state
    expect(player.currentRoomId).toBe('cabin-1');
    
    // Try to move through the small door (should be possible)
    const result = navigationSystem.moveThroughDoor('player1', 'door-1', 'forest-1');
    expect(result).toBe(true);
    
    // Verify player moved
    expect(player.currentRoomId).toBe('forest-1');
    
    // Verify door connection properties are set correctly
    const cabin = roomSystem.getRoom('cabin-1');
    expect(cabin.connections.east.isDoor).toBe(true);
    expect(cabin.connections.east.canCrawlThrough).toBe(true);
  });
});