import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { NavigationSystem } from './player-navigation';


describe('NavigationSystem', () => {
  let roomSystem: RoomSystem;
  let itemSystem: ItemSystem;
  let navigationSystem: NavigationSystem;
  
  beforeEach(() => {
    roomSystem = new RoomSystem();
    itemSystem = new ItemSystem();
    navigationSystem = new NavigationSystem(roomSystem, itemSystem);
  });
  
  it('should create a player correctly', () => {
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'room-1'
    );
    
    expect(player.id).toBe('player1');
    expect(player.name).toBe('Test Player');
    expect(player.currentRoomId).toBe('room-1');
  });
  
  it('should move a player to a different room', () => {
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'room-1'
    );
    
    // Move the player
    const moved = navigationSystem.movePlayer('player1', 'room-2');
    
    expect(moved).toBe(true);
    expect(player.currentRoomId).toBe('room-2');
  });
  
  it('should handle moving through a door', () => {
    // Create rooms
    const room1 = roomSystem.createRoom(
      'room-1',
      'Cabin',
      'A small cabin with wooden walls',
      { x: 0, y: 0 },
      { width: 10, height: 10 }
    );
    
    const room2 = roomSystem.createRoom(
      'room-2',
      'Forest',
      'A forest of brambles',
      { x: 10, y: 0 },
      { width: 10, height: 10 }
    );
    
    // Create a player
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'room-1'
    );
    
    // Move through door (in this simplified version, just move)
    const moved = navigationSystem.moveThroughDoor('player1', 'door-1', 'room-2');
    
    expect(moved).toBe(true);
  });
});