import { GameSystems } from './game-systems';
import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { NavigationSystem } from './player-navigation';

describe('Game Systems', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    gameSystems = new GameSystems();
  });
  
  it('should initialize room system correctly', () => {
    const roomSystem = gameSystems.getRoomSystem();
    expect(roomSystem).toBeInstanceOf(RoomSystem);
  });
  
  it('should initialize item system correctly', () => {
    const itemSystem = gameSystems.getItemSystem();
    expect(itemSystem).toBeInstanceOf(ItemSystem);
  });
  
  it('should initialize navigation system correctly', () => {
    const navigationSystem = gameSystems.getNavigationSystem();
    expect(navigationSystem).toBeInstanceOf(NavigationSystem);
  });
});

describe('Room System', () => {
  let roomSystem: RoomSystem;
  
  beforeEach(() => {
    roomSystem = new RoomSystem();
  });
  
  it('should create a room with correct properties', () => {
    const room = roomSystem.createRoom(
      'room1',
      'Test Room',
      'A test room for our system',
      { x: 0, y: 0 },
      { width: 100, height: 100 }
    );
    
    expect(room.id).toBe('room1');
    expect(room.name).toBe('Test Room');
    expect(room.description).toBe('A test room for our system');
    expect(room.position.x).toBe(0);
    expect(room.position.y).toBe(0);
    expect(room.size.width).toBe(100);
    expect(room.size.height).toBe(100);
  });
  
  it('should add connections between rooms', () => {
    const room1 = roomSystem.createRoom(
      'room1',
      'Room 1',
      'First room',
      { x: 0, y: 0 },
      { width: 100, height: 100 }
    );
    
    const room2 = roomSystem.createRoom(
      'room2',
      'Room 2',
      'Second room',
      { x: 100, y: 0 },
      { width: 100, height: 100 }
    );
    
    // Add connection
    roomSystem.addConnection('room1', 'room2', 'east');
    
    const connections = room1.connections;
    expect(connections).toBeDefined();
    expect(Object.keys(connections)).toContain('east');
  });
  
  it('should retrieve rooms by ID', () => {
    const room = roomSystem.createRoom(
      'test-room',
      'Test Room',
      'A test room',
      { x: 0, y: 0 },
      { width: 100, height: 100 }
    );
    
    const retrievedRoom = roomSystem.getRoom('test-room');
    expect(retrievedRoom).toEqual(room);
  });
});

describe('Item System', () => {
  let itemSystem: ItemSystem;
  
  beforeEach(() => {
    itemSystem = new ItemSystem();
  });
  
  it('should create an item with correct properties', () => {
    const item = itemSystem.createItem(
      'sword1',
      'Iron Sword',
      'A sharp iron sword',
      'weapon',
      50,
      3
    );
    
    expect(item.id).toBe('sword1');
    expect(item.name).toBe('Iron Sword');
    expect(item.description).toBe('A sharp iron sword');
    expect(item.type).toBe('weapon');
    expect(item.value).toBe(50);
    expect(item.weight).toBe(3);
  });
  
  it('should manage inventory items', () => {
    const item = itemSystem.createItem(
      'potion1',
      'Health Potion',
      'Restores health',
      'consumable'
    );
    
    // Add to player's inventory
    itemSystem.addItemToInventory('player1', item);
    
    // Check if it exists in inventory
    const inventory = itemSystem.getInventory('player1');
    expect(inventory).toBeDefined();
    expect(inventory?.items.length).toBe(1);
  });
});

describe('Navigation System', () => {
  let navigationSystem: NavigationSystem;
  
  beforeEach(() => {
    navigationSystem = new NavigationSystem();
  });
  
  it('should create a player with correct properties', () => {
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'room1',
      100
    );
    
    expect(player.id).toBe('player1');
    expect(player.name).toBe('Test Player');
    expect(player.currentRoomId).toBe('room1');
    expect(player.health).toBe(100);
  });
  
  it('should move a player to a different room', () => {
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'room1'
    );
    
    // Move player
    const result = navigationSystem.movePlayer('player1', 'room2');
    
    expect(result).toBe(true);
    expect(player.currentRoomId).toBe('room2');
  });
});