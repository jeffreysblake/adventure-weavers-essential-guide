import { GameSystems } from './game-systems';
import { CommandProcessor } from './command-processor';


describe('Comprehensive User Story Test', () => {
  let gameSystems: GameSystems;
  let commandProcessor: CommandProcessor;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
    commandProcessor = new CommandProcessor(gameSystems);
  });
  
  it('should execute full user story with room descriptions and door navigation', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Step 1: Create rooms as described in user story
    // Pirate ship deck with cannonball landing near TNT
    const deckRoom = roomSystem.createRoom(
      'deck-1',
      'Pirate Ship Deck',
      'A large wooden deck of a pirate ship. Cannonballs have landed nearby.',
      'The deck is wide and open, with the sounds of battle still echoing around you. A cannonball has just crashed into the wood near your feet, sending up a cloud of splinters.',
      { x: 0, y: 0 },
      { width: 20, height: 20 }
    );
    
    // Cabin with treasure chest and small door
    const cabinRoom = roomSystem.createRoom(
      'cabin-1',
      'Cabin',
      'A small wooden cabin with a door.',
      'The cabin is cramped, but you can see a treasure chest in the corner. There\'s also a very small door leading to another area.',
      { x: 20, y: 0 },
      { width: 10, height: 10 }
    );
    
    // Forest of brambles
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Forest of Brambles',
      'A dense forest filled with thorny brambles.',
      'The forest is thick and dark, with brambles that seem to move in the shadows. You can hear something rustling nearby.',
      { x: 30, y: 0 },
      { width: 20, height: 20 }
    );
    
    // Connect rooms
    roomSystem.addConnection('deck-1', 'cabin-1', 'east');
    roomSystem.addConnection('cabin-1', 'forest-1', 'east', false, undefined, true, true);
    
    // Step 2: Create items as described in user story
    const treasureChest = itemSystem.createItem(
      'chest-1',
      'Treasure Chest',
      'A wooden chest with a lock',
      'container',
      undefined,
      undefined,
      true,
      true
    );
    
    const fireballPotion = itemSystem.createItem(
      'potion-1',
      'Fireball Potion',
      'A glowing potion that explodes when thrown'
    );
    
    const sword = itemSystem.createItem(
      'sword-1',
      'Sword of Light',
      'A magical sword'
    );
    
    // Add items to rooms
    roomSystem.addItemToRoom('cabin-1', 'chest-1');
    roomSystem.addItemToRoom('forest-1', 'sword-1');
    
    // Step 3: Create player
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'deck-1'
    );
    
    // Step 4: Execute user story steps
    // 1. Cannonball lands near TNT, far enough away from player that they don't get damaged
    expect(player.currentRoomId).toBe('deck-1');
    
    // 2. Player runs inside nearest cabin door
    const moveResult = navigationSystem.movePlayer('player1', 'cabin-1');
    expect(moveResult).toBe(true);
    expect(player.currentRoomId).toBe('cabin-1');
    
    // 3. Encounter small room with treasure chest and very small door
    const openChest = commandProcessor.processCommand("I want to open chest");
    expect(openChest.success).toBe(true);
    
    // 4. Player opens the chest (contains fireball potion)
    const usePotion = commandProcessor.processCommand("I want to use potion");
    expect(usePotion.success).toBe(true);
    
    // 5. Player crawls through small door
    const crawlResult = navigationSystem.moveThroughDoor('player1', 'door-1', 'forest-1');
    expect(crawlResult).toBe(true);
    
    // 6. On the other side is a forest of brambles, player throws potion at them
    const throwPotion = commandProcessor.processCommand("I want to throw potion at brambles");
    expect(throwPotion.success).toBe(true);
    
    // 7. Player sees sword lying on the ground and can pick it up
    const takeSword = commandProcessor.processCommand("I want to take sword");
    expect(takeSword.success).toBe(true);
    
    // Step 5: Verify all aspects of user story are complete
    // Player should be in forest room now
    expect(player.currentRoomId).toBe('forest-1');
    
    // Room descriptions should be properly set
    const deck = roomSystem.getRoom('deck-1');
    const cabin = roomSystem.getRoom('cabin-1');
    const forest = roomSystem.getRoom('forest-1');
    
    expect(deck).toBeDefined();
    expect(cabin).toBeDefined();
    expect(forest).toBeDefined();
    
    // Verify narrative descriptions are present
    expect(deck.narrative).toContain('cannonball');
    expect(cabin.narrative).toContain('treasure chest');
    expect(forest.narrative).toContain('brambles');
    
    // Verify room connections work properly
    expect(cabin.connections.east.isDoor).toBe(true);
    expect(cabin.connections.east.canCrawlThrough).toBe(true);
  });
});