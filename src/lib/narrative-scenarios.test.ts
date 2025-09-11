/**
 * Narrative Scenarios Test
 * Tests complete story scenarios of different lengths and complexity
 * Small (3-5 actions), Medium (10-15 actions), Long (20+ actions)
 */

import { GameSystems } from './game-systems';
import { CommandProcessor } from './command-processor';

describe('Narrative Scenarios', () => {
  let gameSystems: GameSystems;
  let commandProcessor: CommandProcessor;
  
  beforeEach(() => {
    gameSystems = new GameSystems();
    commandProcessor = new CommandProcessor(gameSystems);
  });

  describe('Short Narratives (3-5 Actions)', () => {
    it('should handle "The Mysterious Lamp" - A quick treasure hunt', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      const navigationSystem = gameSystems.getNavigationSystem();
      
      // Create a simple two-room scenario
      const attic = roomSystem.createRoom(
        'dusty-attic',
        'Dusty Attic',
        'A forgotten attic filled with old furniture.',
        'Cobwebs dance in the dim light filtering through a small window. An old trunk sits in the corner.',
        { x: 0, y: 0 },
        { width: 15, height: 15 }
      );
      
      const basement = roomSystem.createRoom(
        'dark-basement', 
        'Dark Basement',
        'A damp basement with stone walls.',
        'The air is musty and you can hear dripping water. A pedestal stands in the center of the room.',
        { x: 0, y: -10 },
        { width: 15, height: 15 }
      );
      
      // Connect the rooms
      roomSystem.addConnection('dusty-attic', 'dark-basement', 'down');
      roomSystem.addConnection('dark-basement', 'dusty-attic', 'up');
      
      // Create items for the narrative
      const oldKey = itemSystem.createItem(
        'old-key',
        'Old Brass Key',
        'A tarnished brass key.',
        'key',
        undefined,
        0.1,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const treasureChest = itemSystem.createItem(
        'treasure-chest',
        'Treasure Chest',
        'An ornate chest with intricate carvings.',
        'container',
        undefined,
        10,
        false, // too heavy to take
        true,
        ['golden-lamp'], // contains lamp
        'locked',
        150,
        'old-key'
      );
      
      const goldenLamp = itemSystem.createItem(
        'golden-lamp',
        'Golden Lamp',
        'A beautiful lamp that seems to glow with inner light.',
        'quest-item',
        500,
        2,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      // Place items
      roomSystem.addItemToRoom('dusty-attic', 'old-key');
      roomSystem.addItemToRoom('dark-basement', 'treasure-chest');
      
      // Create player
      const player = navigationSystem.createPlayer('player1', 'Adventurer', 'dusty-attic');
      
      // Execute the short narrative
      const narrative = [
        { command: "look around the attic", expectSuccess: true },
        { command: "take the old brass key", expectSuccess: true },
        { command: "go down to the basement", expectSuccess: true },
        { command: "examine the treasure chest", expectSuccess: true },
        { command: "use old key on treasure chest", expectSuccess: true }
      ];
      
      narrative.forEach((step, index) => {
        const result = commandProcessor.processCommand(step.command);
        expect(result.success).toBe(step.expectSuccess);
        expect(result.message.length).toBeGreaterThan(0);
        
        // Log the narrative progression
        console.log(`Step ${index + 1}: "${step.command}" -> "${result.message}"`);
      });
    });

    it('should handle "The Talking Tree" - A simple character interaction', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      
      const enchantedGrove = roomSystem.createRoom(
        'enchanted-grove',
        'Enchanted Grove',
        'A peaceful grove with ancient trees.',
        'Sunlight filters through the canopy, and you sense ancient magic here. One particular oak tree seems to be watching you.',
        { x: 0, y: 0 },
        { width: 25, height: 25 }
      );
      
      const magicalAcorn = itemSystem.createItem(
        'magical-acorn',
        'Magical Acorn',
        'An acorn that shimmers with fairy dust.',
        'quest-item',
        10,
        0.1,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      roomSystem.addItemToRoom('enchanted-grove', 'magical-acorn');
      
      const quickNarrative = [
        { command: "examine the ancient oak tree", expectSuccess: true },
        { command: "talk to the tree", expectSuccess: true },
        { command: "take the magical acorn", expectSuccess: true },
        { command: "give magical acorn to tree", expectSuccess: true }
      ];
      
      quickNarrative.forEach((step, index) => {
        const result = commandProcessor.processCommand(step.command);
        expect(result.success).toBe(step.expectSuccess);
        console.log(`Quick Story ${index + 1}: "${step.command}" -> "${result.message}"`);
      });
    });
  });

  describe('Medium Narratives (10-15 Actions)', () => {
    it('should handle "The Wizard\'s Tower Challenge" - A multi-stage puzzle', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      const navigationSystem = gameSystems.getNavigationSystem();
      
      // Create multiple rooms for the tower
      const towerEntrance = roomSystem.createRoom(
        'tower-entrance',
        'Tower Entrance',
        'The base of a tall wizard\'s tower.',
        'Ancient stones rise impossibly high above you. A heavy door blocks your path, and strange symbols glow on the walls.',
        { x: 0, y: 0 },
        { width: 20, height: 20 }
      );
      
      const libraryRoom = roomSystem.createRoom(
        'library-room',
        'Mystical Library',
        'A room filled with floating books and scrolls.',
        'Knowledge seems to flow through the air itself. A crystal pedestal holds an ancient spellbook.',
        { x: 0, y: 10 },
        { width: 25, height: 25 }
      );
      
      const laboratoryRoom = roomSystem.createRoom(
        'alchemy-lab',
        'Alchemy Laboratory',
        'A laboratory with bubbling cauldrons.',
        'Colorful potions line the walls, and a large cauldron bubbles with mysterious brew. Ingredients float in magical suspension.',
        { x: 0, y: 20 },
        { width: 20, height: 20 }
      );
      
      const towerTop = roomSystem.createRoom(
        'tower-summit',
        'Tower Summit',
        'The top of the wizard\'s tower.',
        'You stand at the pinnacle of magical power. A crystal orb pulses with energy, and the view spans the entire realm below.',
        { x: 0, y: 30 },
        { width: 15, height: 15 }
      );
      
      // Connect rooms
      roomSystem.addConnection('tower-entrance', 'library-room', 'up');
      roomSystem.addConnection('library-room', 'alchemy-lab', 'up'); 
      roomSystem.addConnection('alchemy-lab', 'tower-summit', 'up');
      roomSystem.addConnection('library-room', 'tower-entrance', 'down');
      roomSystem.addConnection('alchemy-lab', 'library-room', 'down');
      roomSystem.addConnection('tower-summit', 'alchemy-lab', 'down');
      
      // Create puzzle items
      const entranceKey = itemSystem.createItem(
        'entrance-key',
        'Stone Key',
        'A key carved from enchanted stone.',
        'key',
        undefined,
        1,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const spellbook = itemSystem.createItem(
        'ancient-spellbook',
        'Ancient Spellbook',
        'A tome containing powerful magical knowledge.',
        'quest-item',
        undefined,
        3,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const magicHerbs = itemSystem.createItem(
        'magic-herbs',
        'Mystical Herbs',
        'Rare herbs that glow with inner light.',
        'consumable',
        undefined,
        0.5,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const crystalVial = itemSystem.createItem(
        'crystal-vial',
        'Crystal Vial',
        'An empty vial made of pure crystal.',
        'container',
        undefined,
        0.3,
        true,
        true,
        [],
        'normal',
        100
      );
      
      const magicPotion = itemSystem.createItem(
        'levitation-potion',
        'Levitation Potion',
        'A potion that allows magical flight.',
        'consumable',
        undefined,
        0.4,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const masterOrb = itemSystem.createItem(
        'master-orb',
        'Master\'s Orb',
        'The wizard\'s most prized possession.',
        'quest-item',
        1000,
        5,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      // Place items
      roomSystem.addItemToRoom('tower-entrance', 'entrance-key');
      roomSystem.addItemToRoom('library-room', 'ancient-spellbook');
      roomSystem.addItemToRoom('alchemy-lab', 'magic-herbs');
      roomSystem.addItemToRoom('alchemy-lab', 'crystal-vial');
      roomSystem.addItemToRoom('tower-summit', 'master-orb');
      
      // Create player
      const player = navigationSystem.createPlayer('player1', 'Apprentice', 'tower-entrance');
      
      // Execute the medium-length narrative
      const mediumNarrative = [
        { command: "examine the tower entrance", expectSuccess: true },
        { command: "look for a way to open the door", expectSuccess: true },
        { command: "take the stone key", expectSuccess: true },
        { command: "use stone key on door", expectSuccess: true },
        { command: "go up to the library", expectSuccess: true },
        { command: "examine the floating books", expectSuccess: true },
        { command: "take the ancient spellbook", expectSuccess: true },
        { command: "read the spellbook to learn magic", expectSuccess: true },
        { command: "go up to the laboratory", expectSuccess: true },
        { command: "examine the bubbling cauldrons", expectSuccess: true },
        { command: "take the mystical herbs", expectSuccess: true },
        { command: "take the crystal vial", expectSuccess: true },
        { command: "combine herbs with vial to make potion", expectSuccess: true },
        { command: "go up to the tower summit", expectSuccess: true },
        { command: "take the master orb as reward", expectSuccess: true }
      ];
      
      mediumNarrative.forEach((step, index) => {
        const result = commandProcessor.processCommand(step.command);
        expect(result.success).toBe(step.expectSuccess);
        expect(result.message.length).toBeGreaterThan(0);
        console.log(`Medium Story ${index + 1}: "${step.command}" -> "${result.message}"`);
      });
    });
  });

  describe('Long Narratives (20+ Actions)', () => {
    it('should handle "The Dragon\'s Lair Epic" - A comprehensive adventure', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      const navigationSystem = gameSystems.getNavigationSystem();
      
      // Create an extensive world
      const villageSquare = roomSystem.createRoom(
        'village-square',
        'Village Square',
        'A bustling village center.',
        'Merchants sell their wares while children play nearby. An old sage sits by the fountain, and you notice a blacksmith\'s shop to the east.',
        { x: 0, y: 0 },
        { width: 30, height: 30 }
      );
      
      const blacksmithShop = roomSystem.createRoom(
        'blacksmith-shop',
        'Blacksmith\'s Shop',
        'A hot, smoky forge.',
        'The ring of hammer on anvil fills the air. Weapons and armor line the walls, and a massive forge blazes in the center.',
        { x: 30, y: 0 },
        { width: 20, height: 20 }
      );
      
      const enchantedForest = roomSystem.createRoom(
        'enchanted-forest',
        'Enchanted Forest',
        'A magical forest filled with ancient trees.',
        'Mystical creatures peek from behind massive oak trees. A path winds deeper into the forest, and you hear the sound of running water.',
        { x: 0, y: 30 },
        { width: 40, height: 40 }
      );
      
      const hiddenGrove = roomSystem.createRoom(
        'hidden-grove',
        'Hidden Grove',
        'A secret grove with a crystal spring.',
        'Pure water flows from a crystal spring, and rare flowers bloom in impossible colors. Ancient magic is strong here.',
        { x: 20, y: 50 },
        { width: 20, height: 20 }
      );
      
      const mountainPath = roomSystem.createRoom(
        'mountain-path',
        'Treacherous Mountain Path',
        'A narrow path carved into the mountainside.',
        'The path is barely wide enough for one person, with a sheer drop on one side and towering cliffs on the other.',
        { x: 40, y: 30 },
        { width: 15, height: 60 }
      );
      
      const dragonCave = roomSystem.createRoom(
        'dragon-cave',
        'Dragon\'s Lair',
        'The ancient dragon\'s cave.',
        'Massive bones litter the floor, and gold gleams in enormous piles. The air is thick with the scent of sulfur and ancient power.',
        { x: 55, y: 60 },
        { width: 50, height: 30 }
      );
      
      const treasureVault = roomSystem.createRoom(
        'treasure-vault',
        'Dragon\'s Treasure Vault', 
        'A chamber filled with legendary treasures.',
        'Artifacts from ages past shine with their own inner light. This is the accumulated wealth of centuries.',
        { x: 75, y: 45 },
        { width: 25, height: 25 }
      );
      
      // Connect all the rooms
      roomSystem.addConnection('village-square', 'blacksmith-shop', 'east');
      roomSystem.addConnection('village-square', 'enchanted-forest', 'north');
      roomSystem.addConnection('blacksmith-shop', 'village-square', 'west');
      roomSystem.addConnection('enchanted-forest', 'village-square', 'south');
      roomSystem.addConnection('enchanted-forest', 'hidden-grove', 'northeast');
      roomSystem.addConnection('enchanted-forest', 'mountain-path', 'east');
      roomSystem.addConnection('hidden-grove', 'enchanted-forest', 'southwest');
      roomSystem.addConnection('mountain-path', 'enchanted-forest', 'west');
      roomSystem.addConnection('mountain-path', 'dragon-cave', 'north');
      roomSystem.addConnection('dragon-cave', 'mountain-path', 'south');
      roomSystem.addConnection('dragon-cave', 'treasure-vault', 'east');
      roomSystem.addConnection('treasure-vault', 'dragon-cave', 'west');
      
      // Create an extensive item set for the epic adventure
      const villageMap = itemSystem.createItem('village-map', 'Village Map', 'A map showing local landmarks.', 'quest-item');
      const goldCoins = itemSystem.createItem('gold-coins', 'Gold Coins', 'A pouch of gold coins.', 'quest-item', 50);
      const ironSword = itemSystem.createItem('iron-sword', 'Iron Sword', 'A well-crafted iron sword.', 'weapon', undefined, 3);
      const dragonScaleArmor = itemSystem.createItem('dragon-armor', 'Dragon Scale Armor', 'Armor made from dragon scales.', 'armor', undefined, 8);
      const healingPotion = itemSystem.createItem('healing-potion', 'Healing Potion', 'A potion that restores health.', 'consumable');
      const magicRope = itemSystem.createItem('magic-rope', 'Magic Rope', 'A rope that extends infinitely.', 'quest-item', undefined, 2);
      const fairyWater = itemSystem.createItem('fairy-water', 'Fairy Water', 'Water blessed by forest fairies.', 'consumable');
      const dragonKey = itemSystem.createItem('dragon-key', 'Dragon Key', 'A key carved from dragon bone.', 'key');
      const ancientScroll = itemSystem.createItem('ancient-scroll', 'Ancient Scroll', 'A scroll with dragon-binding spells.', 'quest-item');
      const dragonEgg = itemSystem.createItem('dragon-egg', 'Dragon Egg', 'A massive dragon egg.', 'quest-item', 1000, 15);
      const crownOfPower = itemSystem.createItem('crown-of-power', 'Crown of Power', 'A crown that grants magical abilities.', 'quest-item', 5000, 2);
      
      // Place items throughout the world
      roomSystem.addItemToRoom('village-square', 'village-map');
      roomSystem.addItemToRoom('village-square', 'gold-coins');
      roomSystem.addItemToRoom('blacksmith-shop', 'iron-sword');
      roomSystem.addItemToRoom('blacksmith-shop', 'dragon-armor');
      roomSystem.addItemToRoom('blacksmith-shop', 'healing-potion');
      roomSystem.addItemToRoom('enchanted-forest', 'magic-rope');
      roomSystem.addItemToRoom('hidden-grove', 'fairy-water');
      roomSystem.addItemToRoom('hidden-grove', 'ancient-scroll');
      roomSystem.addItemToRoom('dragon-cave', 'dragon-key');
      roomSystem.addItemToRoom('dragon-cave', 'dragon-egg');
      roomSystem.addItemToRoom('treasure-vault', 'crown-of-power');
      
      // Create player
      const player = navigationSystem.createPlayer('player1', 'Hero', 'village-square');
      
      // Execute the long epic narrative
      const epicNarrative = [
        { command: "examine the village square", expectSuccess: true },
        { command: "talk to the old sage about dragons", expectSuccess: true },
        { command: "take the village map", expectSuccess: true },
        { command: "take the gold coins", expectSuccess: true },
        { command: "go east to the blacksmith shop", expectSuccess: true },
        { command: "examine the weapons and armor", expectSuccess: true },
        { command: "buy the iron sword with gold", expectSuccess: true },
        { command: "take the dragon scale armor", expectSuccess: true },
        { command: "take the healing potion for safety", expectSuccess: true },
        { command: "go west back to village square", expectSuccess: true },
        { command: "go north to the enchanted forest", expectSuccess: true },
        { command: "listen to the sounds of the forest", expectSuccess: true },
        { command: "take the magic rope", expectSuccess: true },
        { command: "go northeast to the hidden grove", expectSuccess: true },
        { command: "examine the crystal spring", expectSuccess: true },
        { command: "take the fairy water", expectSuccess: true },
        { command: "take the ancient scroll", expectSuccess: true },
        { command: "read the scroll to learn dragon magic", expectSuccess: true },
        { command: "go southwest back to forest", expectSuccess: true },
        { command: "go east to the mountain path", expectSuccess: true },
        { command: "carefully navigate the treacherous path", expectSuccess: true },
        { command: "use magic rope for safety", expectSuccess: true },
        { command: "go north to the dragon cave", expectSuccess: true },
        { command: "examine the massive dragon bones", expectSuccess: true },
        { command: "search for the dragon key", expectSuccess: true },
        { command: "take the dragon key carefully", expectSuccess: true },
        { command: "examine the dragon egg", expectSuccess: true },
        { command: "take the dragon egg", expectSuccess: true },
        { command: "go east to the treasure vault", expectSuccess: true },
        { command: "use dragon key on treasure vault", expectSuccess: true },
        { command: "examine the legendary treasures", expectSuccess: true },
        { command: "take the crown of power", expectSuccess: true },
        { command: "wear the crown to gain magical abilities", expectSuccess: true }
      ];
      
      epicNarrative.forEach((step, index) => {
        const result = commandProcessor.processCommand(step.command);
        expect(result.success).toBe(step.expectSuccess);
        expect(result.message.length).toBeGreaterThan(0);
        console.log(`Epic Story ${index + 1}: "${step.command}" -> "${result.message}"`);
      });
      
      // Verify the epic adventure was completed successfully
      expect(epicNarrative.length).toBeGreaterThan(20);
      console.log(`Completed epic adventure with ${epicNarrative.length} actions!`);
    });
  });

  describe('Branching Narrative Scenarios', () => {
    it('should handle choice-based storytelling', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      
      const crossroads = roomSystem.createRoom(
        'crossroads',
        'Mysterious Crossroads',
        'Three paths diverge in a dark wood.',
        'Each path leads to a different destiny. To the left, you hear the sound of rushing water. Straight ahead, you see flickering lights. To the right, you sense ancient magic.',
        { x: 0, y: 0 },
        { width: 20, height: 20 }
      );
      
      const waterfall = roomSystem.createRoom(
        'hidden-waterfall',
        'Hidden Waterfall',
        'A beautiful waterfall in a secluded glen.',
        'Rainbow mist dances in the sunlight, and you feel a sense of peace and renewal.',
        { x: -20, y: 0 },
        { width: 15, height: 15 }
      );
      
      const hauntedRuins = roomSystem.createRoom(
        'haunted-ruins',
        'Haunted Ruins',
        'Ancient ruins filled with ghostly whispers.',
        'Broken columns reach toward the sky like accusing fingers, and you feel watched by unseen eyes.',
        { x: 0, y: 20 },
        { width: 25, height: 25 }
      );
      
      const faeryRing = roomSystem.createRoom(
        'faery-ring',
        'Faery Ring',
        'A circle of mushrooms in an enchanted clearing.',
        'Tiny lights dance between the mushrooms, and you hear the faint sound of otherworldly music.',
        { x: 20, y: 0 },
        { width: 15, height: 15 }
      );
      
      // Connect the branching paths
      roomSystem.addConnection('crossroads', 'hidden-waterfall', 'west');
      roomSystem.addConnection('crossroads', 'haunted-ruins', 'north');
      roomSystem.addConnection('crossroads', 'faery-ring', 'east');
      roomSystem.addConnection('hidden-waterfall', 'crossroads', 'east');
      roomSystem.addConnection('haunted-ruins', 'crossroads', 'south');
      roomSystem.addConnection('faery-ring', 'crossroads', 'west');
      
      // Create path-specific items
      const crystalOfClarity = itemSystem.createItem('crystal-of-clarity', 'Crystal of Clarity', 'A crystal that reveals truth.', 'quest-item');
      const ghostlyChain = itemSystem.createItem('ghostly-chain', 'Ghostly Chain', 'A chain that binds spirits.', 'quest-item');
      const faeryGift = itemSystem.createItem('faery-gift', 'Faery Gift', 'A gift from the fae folk.', 'quest-item');
      
      roomSystem.addItemToRoom('hidden-waterfall', 'crystal-of-clarity');
      roomSystem.addItemToRoom('haunted-ruins', 'ghostly-chain');
      roomSystem.addItemToRoom('faery-ring', 'faery-gift');
      
      // Test different story branches
      const branches = [
        {
          name: "Peaceful Path",
          commands: [
            "examine the three paths carefully",
            "go west toward the sound of water",
            "examine the beautiful waterfall",
            "take the crystal of clarity"
          ]
        },
        {
          name: "Dangerous Path", 
          commands: [
            "go back to crossroads",
            "go north toward the flickering lights",
            "examine the haunted ruins",
            "take the ghostly chain"
          ]
        },
        {
          name: "Magical Path",
          commands: [
            "go back to crossroads",
            "go east toward the ancient magic",
            "examine the faery ring",
            "take the faery gift"
          ]
        }
      ];
      
      branches.forEach(branch => {
        console.log(`Testing ${branch.name}:`);
        branch.commands.forEach((command, index) => {
          const result = commandProcessor.processCommand(command);
          expect(result.success).toBe(true);
          console.log(`  ${index + 1}: "${command}" -> "${result.message}"`);
        });
      });
    });
  });
});