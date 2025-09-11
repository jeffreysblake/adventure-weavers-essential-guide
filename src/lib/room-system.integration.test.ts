import { RoomSystem } from './room-system';

describe('RoomSystem Integration', () => {
  let roomSystem: RoomSystem;
  
  beforeEach(() => {
    roomSystem = new RoomSystem();
  });
  
  it('should create pirate ship deck, cabin and forest rooms with proper connections', () => {
    // Create the three rooms for your user story
    const deckRoom = roomSystem.createRoom(
      'deck-1',
      'Pirate Ship Deck',
      'A large wooden deck of a pirate ship. Cannonballs have landed nearby.',
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
    
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Forest of Brambles',
      'A dense forest filled with thorny brambles.',
      { x: 30, y: 0 },
      { width: 20, height: 20 }
    );
    
    // Connect the rooms
    roomSystem.addConnection('deck-1', 'cabin-1', 'east');
    roomSystem.addConnection('cabin-1', 'forest-1', 'east');
    
    // Verify rooms were created correctly
    const deck = roomSystem.getRoom('deck-1');
    expect(deck).toBeDefined();
    expect(deck?.name).toBe('Pirate Ship Deck');
    
    const cabin = roomSystem.getRoom('cabin-1');
    expect(cabin).toBeDefined();
    expect(cabin?.name).toBe('Cabin');
    
    const forest = roomSystem.getRoom('forest-1');
    expect(forest).toBeDefined();
    expect(forest?.name).toBe('Forest of Brambles');
    
    // Verify connections
    expect(deck?.connections.east).toBeDefined();
    expect(cabin?.connections.east).toBeDefined();
  });
  
  it('should handle door and crawl space navigation', () => {
    // Create rooms with specific door properties
    const cabin = roomSystem.createRoom(
      'cabin-2',
      'Small Cabin',
      'A tiny cabin with a very small door.',
      { x: 0, y: 0 },
      { width: 10, height: 10 }
    );
    
    const forest = roomSystem.createRoom(
      'forest-2',
      'Bramble Forest',
      'A thorny forest.',
      { x: 10, y: 0 },
      { width: 10, height: 10 }
    );
    
    // Add a door connection with crawl properties
    roomSystem.addConnection('cabin-2', 'forest-2', 'east', false, undefined, true, true);
    
    const cabinRoom = roomSystem.getRoom('cabin-2');
    expect(cabinRoom?.connections.east).toBeDefined();
    expect(cabinRoom?.connections.east.isDoor).toBe(true);
    expect(cabinRoom?.connections.east.canCrawlThrough).toBe(true);
  });
});