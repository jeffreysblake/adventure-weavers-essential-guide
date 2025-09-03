import { GameSystems } from './game-systems';
import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { NavigationSystem } from './player-navigation';

describe('Game Systems Integration', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    gameSystems = new GameSystems();
  });
  
  it('should properly integrate room, item and navigation systems', () => {
    // Get individual systems
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Verify each system is correctly instantiated
    expect(roomSystem).toBeInstanceOf(RoomSystem);
    expect(itemSystem).toBeInstanceOf(ItemSystem);
    expect(navigationSystem).toBeInstanceOf(NavigationSystem);
  });
  
  it('should allow creating rooms, items and players', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Create a room
    const testRoom = roomSystem.createRoom(
      'test-room',
      'Test Room',
      'A test room for integration testing',
      { x: 10, y: 20 },
      { width: 50, height: 60 }
    );
    
    // Create an item
    const testItem = itemSystem.createItem(
      'test-item',
      'Test Item',
      'A test item for integration testing',
      'weapon'
    );
    
    // Create a player
    const testPlayer = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'test-room'
    );
    
    // Verify all were created correctly
    expect(testRoom.id).toBe('test-room');
    expect(testItem.id).toBe('test-item');
    expect(testPlayer.id).toBe('player1');
  });
  
  it('should allow connecting rooms and navigating between them', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Create two rooms
    const room1 = roomSystem.createRoom(
      'room1',
      'Room One',
      'First room',
      { x: 0, y: 0 },
      { width: 100, height: 100 }
    );
    
    const room2 = roomSystem.createRoom(
      'room2',
      'Room Two',
      'Second room',
      { x: 100, y: 0 },
      { width: 100, height: 100 }
    );
    
    // Connect rooms
    roomSystem.addConnection('room1', 'room2', 'east');
    
    // Create a player in the first room
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'room1'
    );
    
    // Verify connection exists
    expect(room1.connections).toBeDefined();
    expect(Object.keys(room1.connections)).toContain('east');
    
    // Move player to second room
    const result = navigationSystem.movePlayer('player1', 'room2');
    
    // Verify player moved correctly
    expect(result).toBe(true);
    expect(player.currentRoomId).toBe('room2');
  });
});