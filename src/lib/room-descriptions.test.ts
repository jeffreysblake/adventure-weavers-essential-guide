import { GameSystems } from './game-systems';

describe('Room Descriptions Test', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should properly handle room descriptions and narratives', () => {
    const roomSystem = gameSystems.getRoomSystem();
    
    // Create rooms with detailed descriptions
    const deckRoom = roomSystem.createRoom(
      'deck-1',
      'Pirate Ship Deck',
      'A large wooden deck of a pirate ship.',
      'The deck is wide and open, with the sounds of battle still echoing around you. A cannonball has just crashed into the wood near your feet, sending up a cloud of splinters.',
      { x: 0, y: 0 },
      { width: 20, height: 20 }
    );
    
    const cabinRoom = roomSystem.createRoom(
      'cabin-1',
      'Cabin',
      'A small wooden cabin with a door.',
      'The cabin is cramped, but you can see a treasure chest in the corner. There\'s also a very small door leading to another area.',
      { x: 20, y: 0 },
      { width: 10, height: 10 }
    );
    
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Forest of Brambles',
      'A dense forest filled with thorny brambles.',
      'The forest is thick and dark, with brambles that seem to move in the shadows. You can hear something rustling nearby.',
      { x: 30, y: 0 },
      { width: 20, height: 20 }
    );
    
    // Verify all rooms were created with proper descriptions
    expect(deckRoom.name).toBe('Pirate Ship Deck');
    expect(deckRoom.description).toContain('pirate ship');
    expect(deckRoom.narrative).toContain('cannonball');
    
    expect(cabinRoom.name).toBe('Cabin');
    expect(cabinRoom.description).toContain('wooden cabin');
    expect(cabinRoom.narrative).toContain('treasure chest');
    
    expect(forestRoom.name).toBe('Forest of Brambles');
    expect(forestRoom.description).toContain('dense forest');
    expect(forestRoom.narrative).toContain('brambles that seem to move');
  });
});