import { GameSystems } from './game-systems';
import { CommandProcessor } from './command-processor';


describe('User Story Integration Test', () => {
  let gameSystems: GameSystems;
  let commandProcessor: CommandProcessor;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
    commandProcessor = new CommandProcessor(gameSystems);
  });
  
  it('should execute full user story scenario', () => {
    // Step 1: Player starts on pirate ship deck
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Create rooms as described in user story
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
    
    // Connect rooms
    roomSystem.addConnection('deck-1', 'cabin-1', 'east');
    roomSystem.addConnection('cabin-1', 'forest-1', 'east');
    
    // Create items as described in user story
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
    
    // Create player
    const player = navigationSystem.createPlayer(
      'player1',
      'Test Player',
      'deck-1'
    );
    
    // Step 2: Cannonball lands near TNT (no damage to player)
    expect(player.currentRoomId).toBe('deck-1');
    
    // Step 3: Player runs inside nearest cabin door
    const moveResult = navigationSystem.movePlayer('player1', 'cabin-1');
    expect(moveResult).toBe(true);
    expect(player.currentRoomId).toBe('cabin-1');
    
    // Step 4: Encounter small room with treasure chest and very small door
    const openChest = commandProcessor.processCommand("I want to open chest");
    expect(openChest.success).toBe(true);
    
    // Step 5: Player opens the chest (contains fireball potion)
    const usePotion = commandProcessor.processCommand("I want to use potion");
    expect(usePotion.success).toBe(true);
    
    // Step 6: Player crawls through door
    const crawlResult = navigationSystem.moveThroughDoor('player1', 'door-1', 'forest-1');
    expect(crawlResult).toBe(true);
    
    // Step 7: Player throws potion at brambles
    const throwPotion = commandProcessor.processCommand("I want to throw potion at brambles");
    expect(throwPotion.success).toBe(true);
    
    // Step 8: Player sees sword on ground and picks it up
    const takeSword = commandProcessor.processCommand("I want to take sword");
    expect(takeSword.success).toBe(true);
    
    // All steps completed successfully
    expect(player.currentRoomId).toBe('forest-1');
  });
});