import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { GameStateManager } from './game-state-manager';


describe('GameStateManager', () => {
  let roomSystem: RoomSystem;
  let itemSystem: ItemSystem;
  let gameStateManager: GameStateManager;
  
  beforeEach(() => {
    roomSystem = new RoomSystem();
    itemSystem = new ItemSystem();
    gameStateManager = new GameStateManager(roomSystem, itemSystem);
  });
  
  it('should initialize a player correctly', () => {
    // Create rooms first
    const deckRoom = roomSystem.createRoom(
      'deck-1',
      'Pirate Ship Deck',
      'A large wooden deck of a pirate ship.',
      { x: 0, y: 0 },
      { width: 20, height: 20 }
    );
    
    // Initialize player
    gameStateManager.initializePlayer('player1', 'Test Player', 'deck-1');
    
    const playerState = gameStateManager.getPlayerState('player1');
    expect(playerState).toBeDefined();
    expect(playerState?.id).toBe('player1');
    expect(playerState?.currentRoomId).toBe('deck-1');
  });
  
  it('should move a player to a different room', () => {
    // Create rooms
    const deckRoom = roomSystem.createRoom(
      'deck-1',
      'Pirate Ship Deck',
      'A large wooden deck of a pirate ship.',
      { x: 0, y: 0 },
      { width: 20, height: 20 }
    );
    
    const cabinRoom = roomSystem.createRoom(
      'cabin-1',
      'Cabin',
      'A small wooden cabin with a door.',
      { x: 20, y: 0 },
      { width: 10, height: 10 }
    );
    
    // Initialize player
    gameStateManager.initializePlayer('player1', 'Test Player', 'deck-1');
    
    // Move player to cabin
    const moved = gameStateManager.movePlayerToRoom('player1', 'cabin-1');
    
    expect(moved).toBe(true);
    
    const playerState = gameStateManager.getPlayerState('player1');
    expect(playerState?.currentRoomId).toBe('cabin-1');
  });
});