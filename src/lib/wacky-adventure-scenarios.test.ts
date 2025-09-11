/**
 * Wacky Adventure Scenarios Test
 * Tests inspired by classic adventure games like King's Quest and Space Quest
 * Challenges the game engine with creative, unexpected, and humorous interactions
 */

import { GameSystems } from './game-systems';
import { CommandProcessor } from './command-processor';
import { NLPProcessor } from './nlp-processor';

describe('Wacky Adventure Scenarios', () => {
  let gameSystems: GameSystems;
  let commandProcessor: CommandProcessor;
  
  beforeEach(() => {
    gameSystems = new GameSystems();
    commandProcessor = new CommandProcessor(gameSystems);
  });

  describe('Natural Language Processing Tests', () => {
    it('should handle various ways of saying the same thing', () => {
      const variations = [
        "take lamp",
        "I want to take the lamp", 
        "can I take the lamp?",
        "please take lamp",
        "pick up the lamp",
        "grab lamp",
        "get the lamp",
        "I would like to pick up the lamp"
      ];
      
      variations.forEach(input => {
        const result = commandProcessor.processCommand(input);
        expect(result.success).toBe(true);
        expect(result.message).toContain('take');
      });
    });

    it('should recognize synonyms for common actions', () => {
      const synonymTests = [
        { input: "grab the sword", expectedAction: "take" },
        { input: "inspect the door", expectedAction: "examine" },
        { input: "smash the vase", expectedAction: "break" },
        { input: "ignite the torch", expectedAction: "burn" },
        { input: "assault the dragon", expectedAction: "attack" },
        { input: "consume the potion", expectedAction: "drink" },
        { input: "don the armor", expectedAction: "wear" },
        { input: "discard the trash", expectedAction: "drop" }
      ];
      
      synonymTests.forEach(test => {
        const result = commandProcessor.processCommand(test.input);
        expect(result.success).toBe(true);
        // The message should reflect the action was understood
        expect(result.message.length).toBeGreaterThan(0);
      });
    });

    it('should filter out stop words and focus on meaningful content', () => {
      const inputs = [
        "I really want to carefully examine the mysterious ancient door",
        "Can you please help me take the shiny golden lamp?",
        "Would it be possible for me to open this old treasure chest?"
      ];
      
      inputs.forEach(input => {
        const result = commandProcessor.processCommand(input);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Classic Adventure Game Scenarios', () => {
    it('should handle the classic "oil lamp and dark cave" scenario', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      
      // Create a dark cave
      const darkCave = roomSystem.createRoom(
        'dark-cave',
        'Dark Cave',
        'A pitch-black cave where you can barely see your hand in front of your face.',
        'The darkness is so complete that you feel like you might fall into an unseen chasm at any moment.',
        { x: 0, y: 0 },
        { width: 20, height: 20 }
      );
      
      // Create an oil lamp
      const oilLamp = itemSystem.createItem(
        'oil-lamp',
        'Oil Lamp',
        'An old brass lamp with a wick.',
        'consumable',
        undefined,
        1,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      // Add lamp to player inventory
      itemSystem.addItemToInventory('player1', oilLamp);
      
      // Test various ways of using the lamp
      const lightCommands = [
        "light the lamp",
        "ignite oil lamp",
        "I want to burn the lamp",
        "can I use the oil lamp please?",
        "turn on lamp"
      ];
      
      lightCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
        expect(result.message.length).toBeGreaterThan(0);
      });
    });

    it('should handle creative item combinations like "use rubber chicken with pulley"', () => {
      const itemSystem = gameSystems.getItemSystem();
      
      // Create the famous rubber chicken and pulley
      const rubberChicken = itemSystem.createItem(
        'rubber-chicken',
        'Rubber Chicken',
        'A yellow rubber chicken that squeaks when squeezed.',
        'quest-item',
        undefined,
        0.5,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const pulley = itemSystem.createItem(
        'pulley',
        'Pulley',
        'A rusty old pulley attached to a rope.',
        'quest-item',
        undefined,
        3,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      itemSystem.addItemToInventory('player1', rubberChicken);
      itemSystem.addItemToInventory('player1', pulley);
      
      // Test creative combinations
      const creativeCommands = [
        "use rubber chicken with pulley",
        "combine the rubber chicken and pulley",
        "attach chicken to pulley",
        "I want to use the rubber chicken on the pulley"
      ];
      
      creativeCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
      });
    });

    it('should handle impossible but humorous attempts', () => {
      const impossibleCommands = [
        "eat the castle",
        "wear the mountain",
        "drink the sword",
        "talk to my shoes",
        "attack the concept of time",
        "open the sky",
        "close the ocean"
      ];
      
      impossibleCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        // Should still succeed but with humorous responses
        expect(result.success).toBe(true);
        expect(result.message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('King\'s Quest Style Puzzles', () => {
    it('should handle the classic "give item to character" interaction', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      
      // Create a magical forest
      const enchantedForest = roomSystem.createRoom(
        'enchanted-forest',
        'Enchanted Forest',
        'A mystical forest where ancient magic still flows.',
        'You can hear whispers in the wind and see movement in the shadows. A wise old hermit sits by a glowing pool.',
        { x: 0, y: 0 },
        { width: 30, height: 30 }
      );
      
      // Create magical items
      const magicBean = itemSystem.createItem(
        'magic-bean',
        'Magic Bean',
        'A shimmering bean that pulses with inner light.',
        'quest-item',
        100,
        0.1,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      itemSystem.addItemToInventory('player1', magicBean);
      
      // Test giving/trading interactions
      const giveCommands = [
        "give magic bean to hermit",
        "offer the bean to the old man",
        "I want to trade my magic bean",
        "can I give the hermit my bean?"
      ];
      
      giveCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
      });
    });

    it('should handle environmental puzzles with multiple objects', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      
      // Create a wizard's tower
      const wizardTower = roomSystem.createRoom(
        'wizard-tower',
        'Wizard\'s Tower',
        'A tall tower filled with magical apparatus.',
        'Ancient books line the walls, and a crystal orb glows on a pedestal. You notice a lever, a mirror, and strange symbols on the floor.',
        { x: 0, y: 0 },
        { width: 15, height: 40 }
      );
      
      // Create puzzle elements
      const crystalOrb = itemSystem.createItem('crystal-orb', 'Crystal Orb', 'A glowing crystal orb.', 'quest-item');
      const ancientMirror = itemSystem.createItem('ancient-mirror', 'Ancient Mirror', 'A mirror with runes around its frame.', 'quest-item');
      const magicLever = itemSystem.createItem('magic-lever', 'Magic Lever', 'A lever covered in mystical symbols.', 'quest-item');
      
      roomSystem.addItemToRoom('wizard-tower', 'crystal-orb');
      roomSystem.addItemToRoom('wizard-tower', 'ancient-mirror');
      roomSystem.addItemToRoom('wizard-tower', 'magic-lever');
      
      // Test complex environmental interactions
      const puzzleCommands = [
        "examine the crystal orb carefully",
        "look at mirror and orb together",
        "pull the lever while holding orb",
        "use mirror to reflect the orb's light",
        "I want to position the mirror near the crystal orb"
      ];
      
      puzzleCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Space Quest Style Sci-Fi Scenarios', () => {
    it('should handle futuristic technology interactions', () => {
      const itemSystem = gameSystems.getItemSystem();
      
      // Create futuristic items
      const phaser = itemSystem.createItem(
        'phaser',
        'Plasma Phaser',
        'A futuristic energy weapon.',
        'weapon',
        undefined,
        2,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const aiCore = itemSystem.createItem(
        'ai-core',
        'AI Core',
        'A sophisticated artificial intelligence module.',
        'quest-item',
        undefined,
        5,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      itemSystem.addItemToInventory('player1', phaser);
      itemSystem.addItemToInventory('player1', aiCore);
      
      // Test sci-fi interactions
      const sciFiCommands = [
        "activate the phaser",
        "interface with AI core",
        "I want to talk to the artificial intelligence",
        "scan the area with phaser",
        "upload data to AI core",
        "calibrate the phaser settings"
      ];
      
      sciFiCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
      });
    });

    it('should handle alien encounter scenarios', () => {
      const roomSystem = gameSystems.getRoomSystem();
      
      const alienPlanet = roomSystem.createRoom(
        'alien-planet',
        'Alien Planet Surface',
        'A bizarre landscape with purple vegetation and floating rocks.',
        'Strange creatures observe you from a distance. The air shimmers with unknown energy, and you hear melodic sounds that might be communication.',
        { x: 0, y: 0 },
        { width: 50, height: 50 }
      );
      
      // Test alien interaction commands
      const alienCommands = [
        "communicate with the aliens using gestures",
        "I want to make peaceful contact",
        "try to understand their language",
        "offer a gift to show friendship",
        "attempt to learn their customs"
      ];
      
      alienCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Edge Cases and Stress Tests', () => {
    it('should handle extremely long and complex commands', () => {
      const complexCommand = "I would really very much like to very carefully and quite thoroughly examine the extremely ancient and incredibly mysterious magical crystal orb that is glowing so brightly on the ornate golden pedestal";
      
      const result = commandProcessor.processCommand(complexCommand);
      expect(result.success).toBe(true);
      expect(result.message).toContain('examine');
    });

    it('should handle commands with multiple items and prepositions', () => {
      const itemSystem = gameSystems.getItemSystem();
      
      // Create multiple items for complex interactions
      const rope = itemSystem.createItem('rope', 'Rope', 'A sturdy rope.', 'quest-item');
      const hook = itemSystem.createItem('hook', 'Grappling Hook', 'A metal hook.', 'quest-item');
      const bridge = itemSystem.createItem('bridge', 'Rope Bridge', 'A wooden bridge.', 'quest-item');
      
      itemSystem.addItemToInventory('player1', rope);
      itemSystem.addItemToInventory('player1', hook);
      
      const complexCommands = [
        "tie the rope to the hook and throw it across the chasm",
        "attach hook to rope, then use it on bridge",
        "I want to combine the rope with the hook and use them together on the bridge"
      ];
      
      complexCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
      });
    });

    it('should handle ambiguous commands gracefully', () => {
      const ambiguousCommands = [
        "use it",
        "take that thing",
        "do something with the stuff",
        "go there",
        "make it work"
      ];
      
      ambiguousCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        // Should either succeed with a reasonable interpretation or provide helpful feedback
        expect(result.message.length).toBeGreaterThan(0);
      });
    });

    it('should handle typos and misspellings reasonably', () => {
      const typoCommands = [
        "tak the lamp",      // missing 'e' in take
        "examie the door",   // missing 'n' in examine  
        "opne the chest",    // swapped letters in open
        "drikn the potion",  // typo in drink
        "attak the dragon"   // typo in attack
      ];
      
      typoCommands.forEach(command => {
        const result = commandProcessor.processCommand(command);
        // Even with typos, the NLP should handle basic recognition
        expect(result.message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Contextual and State-Dependent Interactions', () => {
    it('should handle conditional actions based on game state', () => {
      const roomSystem = gameSystems.getRoomSystem();
      const itemSystem = gameSystems.getItemSystem();
      
      // Create a locked door scenario
      const castle = roomSystem.createRoom(
        'castle-entrance',
        'Castle Entrance',
        'A grand castle with a massive locked door.',
        'The door is made of solid oak and bound with iron. You notice a keyhole and some strange symbols.',
        { x: 0, y: 0 },
        { width: 20, height: 20 }
      );
      
      const lockedDoor = itemSystem.createItem(
        'castle-door',
        'Castle Door', 
        'A massive locked door.',
        'door',
        undefined,
        undefined,
        false, // cannot take
        false,
        undefined,
        'locked',
        200,
        'golden-key' // requires this key
      );
      
      const goldenKey = itemSystem.createItem(
        'golden-key',
        'Golden Key',
        'An ornate golden key with mystical engravings.',
        'key',
        undefined,
        0.2,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      roomSystem.addItemToRoom('castle-entrance', 'castle-door');
      
      // Test trying to open door without key
      let result = commandProcessor.processCommand("open the castle door");
      expect(result.success).toBe(true); // Command understood, but might fail due to lock
      
      // Add key to inventory
      itemSystem.addItemToInventory('player1', goldenKey);
      
      // Test opening door with key
      result = commandProcessor.processCommand("use golden key on castle door");
      expect(result.success).toBe(true);
    });

    it('should handle sequential puzzle solving', () => {
      const itemSystem = gameSystems.getItemSystem();
      
      // Create puzzle items that need to be used in sequence
      const ancientTome = itemSystem.createItem(
        'ancient-tome',
        'Ancient Tome',
        'A book containing ancient spells.',
        'quest-item',
        undefined,
        2,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const magicWand = itemSystem.createItem(
        'magic-wand',
        'Magic Wand',
        'A wand that channels magical energy.',
        'weapon',
        undefined,
        1,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      const spellComponents = itemSystem.createItem(
        'spell-components',
        'Spell Components',
        'Various magical ingredients.',
        'consumable',
        undefined,
        0.5,
        true,
        false,
        undefined,
        'normal',
        100
      );
      
      itemSystem.addItemToInventory('player1', ancientTome);
      itemSystem.addItemToInventory('player1', magicWand);
      itemSystem.addItemToInventory('player1', spellComponents);
      
      // Test sequential spell casting
      const spellSequence = [
        "read the ancient tome to learn the spell",
        "prepare the spell components carefully",
        "wave the magic wand while chanting",
        "cast the spell using all components together"
      ];
      
      spellSequence.forEach(command => {
        const result = commandProcessor.processCommand(command);
        expect(result.success).toBe(true);
      });
    });
  });
});