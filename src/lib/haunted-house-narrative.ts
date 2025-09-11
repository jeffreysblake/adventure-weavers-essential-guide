/**
 * Haunted House Narrative for Quest Weaver
 * Multi-level exploration with stairs, secret passages, and supernatural elements
 */

import { GameSystems } from './game-systems';
import { VerticalNavigationSystem } from './vertical-navigation';
import { NPCFactory } from './npc-manager';

export interface HauntedHouseConfig {
  enableGhosts?: boolean;
  difficulty?: 'easy' | 'normal' | 'hard';
  enableSecretRooms?: boolean;
  enableCurses?: boolean;
}

export class HauntedHouseNarrative {
  private verticalNav: VerticalNavigationSystem;
  private houseRooms: Map<string, any> = new Map();
  private houseNPCs: Map<string, any> = new Map();
  private houseItems: Map<string, any> = new Map();
  private secretsDiscovered: Set<string> = new Set();

  constructor(
    private gameSystems: GameSystems,
    private config: HauntedHouseConfig = {}
  ) {
    this.verticalNav = new VerticalNavigationSystem(
      gameSystems.getRoomSystem(),
      gameSystems.getItemSystem(),
      gameSystems.getGameStateManager?.() || this.createDummyStateManager()
    );
    this.initializeHauntedHouse();
  }

  /**
   * Initialize the complete haunted house with all levels and connections
   */
  private initializeHauntedHouse(): void {
    console.log('🏚️ Initializing Ravencroft Manor - A Haunted House Adventure...');
    
    // Create all rooms first
    this.createGroundFloorRooms();
    this.createSecondFloorRooms();
    this.createAtticRooms();
    this.createBasementRooms();
    this.createSecretRooms();
    
    // Create vertical connections
    this.createVerticalConnections();
    
    // Add items and NPCs
    this.populateRooms();
    
    // Add supernatural elements
    if (this.config.enableGhosts) {
      this.addGhostsAndSpirits();
    }
    
    console.log('✅ Ravencroft Manor initialized with all levels and supernatural elements');
  }

  /**
   * Create ground floor rooms
   */
  private createGroundFloorRooms(): void {
    const roomSystem = this.gameSystems.getRoomSystem();

    // Entry Hall
    const entryHall = roomSystem.createRoom(
      'entry_hall',
      'Grand Entry Hall',
      'A once-magnificent entry hall with a sweeping staircase. Dust motes dance in the pale moonlight filtering through grimy windows. The air is thick with the scent of decay and forgotten memories.',
      'As you step through the heavy oak doors, they creak shut behind you with an ominous thud. The grand staircase dominates the room, its banister worn smooth by countless hands - some perhaps no longer among the living.',
      { x: 0, y: 0 },
      { width: 30, height: 20 }
    );

    // Drawing Room
    const drawingRoom = roomSystem.createRoom(
      'drawing_room',
      'Drawing Room',
      'An elegant drawing room with furniture covered in white sheets. A cold fireplace dominates one wall, its ashes long cold. Portrait paintings line the walls, their eyes seeming to follow your movement.',
      'The sheet-covered furniture creates ghostly silhouettes in the dim light. You notice some of the portrait subjects appear to have moved slightly when you\'re not looking directly at them.',
      { x: 35, y: 0 },
      { width: 25, height: 20 }
    );

    // Kitchen
    const kitchen = roomSystem.createRoom(
      'kitchen',
      'Old Kitchen',
      'A large Victorian kitchen with an ancient cast-iron stove. Pots and pans hang from hooks, occasionally swaying without any apparent breeze. The scent of something cooking lingers, though the stove is clearly cold.',
      'Dried herbs hang from the ceiling beams, and you notice fresh bread crumbs on the counter - impossible, since no one has lived here for decades.',
      { x: 0, y: 25 },
      { width: 20, height: 25 }
    );

    // Library
    const library = roomSystem.createRoom(
      'library',
      'Dusty Library',
      'Floor-to-ceiling bookshelves packed with leather-bound tomes. A reading chair sits by the window, and books occasionally fall from shelves when no one is near them.',
      'The books seem to whisper as you pass, and you swear you can hear the scratch of a quill pen writing, though you see no one.',
      { x: 25, y: 25 },
      { width: 35, height: 25 }
    );

    this.houseRooms.set('entry_hall', entryHall);
    this.houseRooms.set('drawing_room', drawingRoom);
    this.houseRooms.set('kitchen', kitchen);
    this.houseRooms.set('library', library);

    // Connect ground floor rooms horizontally
    entryHall.connections['east'] = 'drawing_room';
    entryHall.connections['south'] = 'kitchen';
    drawingRoom.connections['west'] = 'entry_hall';
    drawingRoom.connections['southwest'] = 'library';
    kitchen.connections['north'] = 'entry_hall';
    kitchen.connections['east'] = 'library';
    library.connections['west'] = 'kitchen';
    library.connections['northwest'] = 'drawing_room';
  }

  /**
   * Create second floor rooms
   */
  private createSecondFloorRooms(): void {
    const roomSystem = this.gameSystems.getRoomSystem();

    // Master Bedroom
    const masterBedroom = roomSystem.createRoom(
      'master_bedroom',
      'Master Bedroom',
      'A grand bedroom with a four-poster bed draped in moldy curtains. The floorboards creak ominously with each step. A vanity mirror reflects more than just your image.',
      'The bed appears to have been recently slept in, with a depression in the pillow and rumpled sheets, though dust covers everything else in the room.',
      { x: 0, y: 60 },
      { width: 30, height: 20 }
    );

    // Guest Bedroom
    const guestBedroom = roomSystem.createRoom(
      'guest_bedroom',
      'Guest Bedroom',
      'A smaller bedroom with a single bed and wardrobe. Children\'s toys are scattered on the floor, despite this being an adult guest room. Laughter echoes softly from nowhere.',
      'The toys move slightly when you\'re not watching, and sometimes you hear the sound of children playing in the walls.',
      { x: 35, y: 60 },
      { width: 20, height: 20 }
    );

    // Bathroom
    const bathroom = roomSystem.createRoom(
      'bathroom',
      'Victorian Bathroom',
      'An old bathroom with a clawfoot tub. The faucets drip blood-red water, though it clears if you look directly at it. The mirror is cracked in a spider web pattern.',
      'You hear the sound of someone bathing, though the tub is empty. The mirror sometimes shows reflections that don\'t match your movements.',
      { x: 0, y: 85 },
      { width: 15, height: 15 }
    );

    // Hallway
    const upstairsHallway = roomSystem.createRoom(
      'upstairs_hallway',
      'Upstairs Hallway',
      'A long corridor lined with family portraits. The carpet runner is worn and frayed. Doors lead to various bedrooms, and you can hear whispers from behind closed doors.',
      'The portraits\' eyes definitely follow you as you walk, and you occasionally glimpse shadowy figures at the end of the hallway.',
      { x: 20, y: 85 },
      { width: 40, height: 10 }
    );

    this.houseRooms.set('master_bedroom', masterBedroom);
    this.houseRooms.set('guest_bedroom', guestBedroom);
    this.houseRooms.set('bathroom', bathroom);
    this.houseRooms.set('upstairs_hallway', upstairsHallway);

    // Connect second floor rooms
    masterBedroom.connections['east'] = 'upstairs_hallway';
    guestBedroom.connections['west'] = 'upstairs_hallway';
    bathroom.connections['east'] = 'upstairs_hallway';
    upstairsHallway.connections['west'] = 'master_bedroom';
    upstairsHallway.connections['southwest'] = 'bathroom';
    upstairsHallway.connections['east'] = 'guest_bedroom';
  }

  /**
   * Create attic rooms
   */
  private createAtticRooms(): void {
    const roomSystem = this.gameSystems.getRoomSystem();

    // Main Attic
    const attic = roomSystem.createRoom(
      'attic',
      'Dusty Attic',
      'A cramped attic filled with old trunks, furniture, and cobwebs. Moonlight streams through a small round window. You hear scurrying sounds, but see no rats.',
      'Old family heirlooms are stored here, and some of them seem to hum with otherworldly energy. A rocking chair rocks gently by itself.',
      { x: 10, y: 110 },
      { width: 30, height: 15 }
    );

    // Storage Room
    const atticStorage = roomSystem.createRoom(
      'attic_storage',
      'Attic Storage',
      'A smaller storage area packed with boxes and old paintings. Some boxes are warm to the touch, and you occasionally hear muffled voices from within them.',
      'The paintings are all turned to face the wall, as if someone - or something - doesn\'t want them to be seen.',
      { x: 45, y: 110 },
      { width: 15, height: 15 }
    );

    this.houseRooms.set('attic', attic);
    this.houseRooms.set('attic_storage', atticStorage);

    // Connect attic rooms
    attic.connections['east'] = 'attic_storage';
    atticStorage.connections['west'] = 'attic';
  }

  /**
   * Create basement rooms
   */
  private createBasementRooms(): void {
    const roomSystem = this.gameSystems.getRoomSystem();

    // Wine Cellar
    const wineCellar = roomSystem.createRoom(
      'wine_cellar',
      'Wine Cellar',
      'A stone-walled cellar with wine racks lining the walls. Most bottles are empty or contain something that doesn\'t look like wine. The temperature is unnaturally cold.',
      'Some bottles glow faintly, and you can hear liquid sloshing in bottles that appear empty. Strange symbols are carved into the stone walls.',
      { x: 0, y: -30 },
      { width: 25, height: 20 }
    );

    // Boiler Room
    const boilerRoom = roomSystem.createRoom(
      'boiler_room',
      'Boiler Room',
      'A mechanical room with an old coal boiler that shouldn\'t work but glows with heat. Pipes snake across the ceiling, occasionally banging as if something is moving through them.',
      'The boiler flames burn blue and green, casting eerie shadows. You hear scratching sounds coming from inside the pipes.',
      { x: 30, y: -30 },
      { width: 20, height: 20 }
    );

    // Root Cellar
    const rootCellar = roomSystem.createRoom(
      'root_cellar',
      'Root Cellar',
      'A dirt-floored storage area with shelves of preserved foods. Some jars contain things that were never meant to be preserved. The earth walls seem to breathe.',
      'The preserves occasionally move within their jars, and you notice fresh dirt has been recently disturbed in one corner.',
      { x: 55, y: -30 },
      { width: 15, height: 20 }
    );

    this.houseRooms.set('wine_cellar', wineCellar);
    this.houseRooms.set('boiler_room', boilerRoom);
    this.houseRooms.set('root_cellar', rootCellar);

    // Connect basement rooms
    wineCellar.connections['east'] = 'boiler_room';
    boilerRoom.connections['west'] = 'wine_cellar';
    boilerRoom.connections['east'] = 'root_cellar';
    rootCellar.connections['west'] = 'boiler_room';
  }

  /**
   * Create secret rooms (if enabled)
   */
  private createSecretRooms(): void {
    if (!this.config.enableSecretRooms) return;

    const roomSystem = this.gameSystems.getRoomSystem();

    // Hidden Study
    const hiddenStudy = roomSystem.createRoom(
      'hidden_study',
      'Hidden Study',
      'A secret study hidden behind the library bookshelf. Ancient tomes of forbidden knowledge line the walls. A summoning circle is carved into the floor.',
      'This is where the mansion\'s original owner practiced dark magic. The air crackles with residual magical energy, and whispers in unknown languages fill the air.',
      { x: 65, y: 30 },
      { width: 20, height: 15 }
    );

    // Priest Hole
    const priestHole = roomSystem.createRoom(
      'priest_hole',
      'Priest Hole',
      'A tiny hidden room behind the master bedroom wall. It\'s barely large enough for one person to hide. Scratch marks cover the walls, and you feel an overwhelming sense of claustrophobia.',
      'Someone - or something - was trapped here for a very long time. The desperate scratches on the walls tell a story of madness and despair.',
      { x: 35, y: 65 },
      { width: 8, height: 8 }
    );

    this.houseRooms.set('hidden_study', hiddenStudy);
    this.houseRooms.set('priest_hole', priestHole);
  }

  /**
   * Create all vertical connections between floors
   */
  private createVerticalConnections(): void {
    // Main staircase from entry hall to upstairs hallway
    this.verticalNav.createStaircase(
      'entry_hall',
      'upstairs_hallway',
      'Grand Staircase'
    );

    // Narrow stairs from kitchen to wine cellar
    this.verticalNav.createConnection(
      'kitchen',
      'wine_cellar',
      'stairs_down',
      'Basement Stairs',
      'Narrow wooden stairs leading down to the basement. The steps creak ominously.',
      {
        difficulty: 0.9,
        movementTime: 8,
        soundEffect: 'creaking_stairs'
      }
    );

    // Attic ladder from upstairs hallway
    this.verticalNav.createConnection(
      'upstairs_hallway',
      'attic',
      'ladder',
      'Attic Ladder',
      'A pull-down ladder leading to the dusty attic above.',
      {
        difficulty: 0.85,
        movementTime: 12,
        requirements: {
          skills: { strength: 3 }
        },
        consequences: {
          failureMessage: 'The old ladder rungs break under your weight!',
          damageonFailure: 5
        }
      }
    );

    // Secret passage from library to hidden study
    if (this.config.enableSecretRooms) {
      this.verticalNav.createConnection(
        'library',
        'hidden_study',
        'magic_portal',
        'Secret Bookshelf Passage',
        'A bookshelf that swings open to reveal a hidden passage.',
        {
          difficulty: 1.0,
          movementTime: 5,
          requirements: {
            items: ['Old Leather Journal'] // Player needs to find the journal first
          }
        }
      );

      // Hidden panel from master bedroom to priest hole
      this.verticalNav.createConnection(
        'master_bedroom',
        'priest_hole',
        'magic_portal',
        'Hidden Wall Panel',
        'A section of the wall that slides away to reveal a cramped hiding space.',
        {
          difficulty: 0.95,
          movementTime: 3,
          requirements: {
            skills: { intelligence: 8 }
          }
        }
      );
    }

    // Dangerous rope from attic window to outside (emergency escape)
    this.verticalNav.createRope(
      'attic',
      'entry_hall', // Represents escaping to outside/ground level
      'Knotted Rope'
    );

    console.log('🪜 All vertical connections created for Ravencroft Manor');
  }

  /**
   * Populate rooms with items and interactive elements
   */
  private populateRooms(): void {
    const itemSystem = this.gameSystems.getItemSystem();

    // Entry Hall items
    const chandelier = itemSystem.createItem(
      'Crystal Chandelier',
      'A massive crystal chandelier hanging precariously above. Some crystals are missing, and it sways slightly.',
      { x: 15, y: 10, z: 8 },
      'crystal',
      { candle_count: 24, lit: false, stability: 'unstable' }
    );

    // Drawing Room items
    const portraitLady = itemSystem.createItem(
      'Portrait of Lady Ravencroft',
      'A haunting portrait of the mansion\'s former mistress. Her eyes seem to follow you, and her expression changes when you\'re not looking.',
      { x: 45, y: 5, z: 4 },
      'canvas',
      { haunted: true, original_subject: 'alive', current_subject: 'deceased' }
    );

    // Library items
    const oldJournal = itemSystem.createItem(
      'Old Leather Journal',
      'A weather-beaten journal containing the mansion owner\'s final entries. The writing becomes increasingly erratic toward the end.',
      { x: 30, y: 35, z: 1 },
      'leather',
      { 
        readable: true, 
        content: 'The whispers are getting louder... I fear I have opened something that should have remained closed...',
        unlocks_secret: 'hidden_study'
      }
    );

    // Kitchen items
    const bloodKnife = itemSystem.createItem(
      'Butcher Knife',
      'A large kitchen knife with stains that look suspiciously like dried blood. It\'s warm to the touch.',
      { x: 10, y: 35, z: 1 },
      'steel',
      { weapon: true, damage: 15, cursed: true }
    );

    // Master Bedroom items
    const handMirror = itemSystem.createItem(
      'Silver Hand Mirror',
      'An ornate hand mirror that shows reflections of people who aren\'t there. Sometimes you see a woman brushing her hair.',
      { x: 20, y: 70, z: 1 },
      'silver',
      { magical: true, shows_past_events: true }
    );

    // Attic items
    const oldTrunk = itemSystem.createItem(
      'Mysterious Trunk',
      'An old steamer trunk locked with a complex mechanism. Strange symbols are carved into its surface, and it hums with energy.',
      { x: 25, y: 115, z: 1 },
      'wood',
      { 
        locked: true, 
        contains: ['Family Heirloom', 'Dark Ritual Components'],
        magical: true
      }
    );

    // Wine Cellar items
    const glowingWine = itemSystem.createItem(
      'Glowing Wine Bottle',
      'A wine bottle containing a luminescent liquid that definitely isn\'t wine. The cork moves occasionally as if something is trying to get out.',
      { x: 15, y: -20, z: 1 },
      'glass',
      { 
        magical: true, 
        consumable: true, 
        effect: 'temporary_supernatural_sight',
        danger_level: 'high'
      }
    );

    this.houseItems.set('chandelier', chandelier);
    this.houseItems.set('portrait_lady', portraitLady);
    this.houseItems.set('old_journal', oldJournal);
    this.houseItems.set('blood_knife', bloodKnife);
    this.houseItems.set('hand_mirror', handMirror);
    this.houseItems.set('old_trunk', oldTrunk);
    this.houseItems.set('glowing_wine', glowingWine);

    console.log('🔍 Haunted items placed throughout Ravencroft Manor');
  }

  /**
   * Add ghosts and supernatural NPCs
   */
  private addGhostsAndSpirits(): void {
    const npcManager = this.gameSystems.getNPCManager();

    // Lady Ravencroft's Ghost
    const ladyGhost = NPCFactory.createFriendlyVillager(
      'lady_ravencroft_ghost',
      'Lady Ravencroft\'s Spirit',
      { x: 45, y: 10, z: 0 }
    );
    ladyGhost.npcType = 'ghost';
    ladyGhost.stats.health = 1; // Ghosts can't really be "killed"
    ladyGhost.description = 'The translucent figure of an elegant woman in Victorian dress. She seems sad and lost, occasionally reaching out as if trying to touch something just beyond her grasp.';
    
    // Create dialogue for the ghost
    const ghostDialogue = new (require('./npc-system').DialogueBuilder)('lady_ghost_chat', 'Conversation with Lady Ravencroft')
      .addNode('greeting', 'You... you can see me? Oh, thank the heavens! I have been alone for so long...', true)
      .addResponse('greeting', 'ask_death', 'What happened to you?', 'death_story')
      .addResponse('greeting', 'ask_house', 'Tell me about this house.', 'house_story')
      .addResponse('greeting', 'ask_help', 'How can I help you?', 'help_story')
      .addNode('death_story', 'My husband... he delved too deep into forbidden knowledge. The things he summoned... they took him first, then came for me.')
      .addResponse('death_story', 'continue', 'Go on...', 'death_details')
      .addNode('house_story', 'This manor has been in our family for generations. But my husband\'s experiments have awakened something evil within these walls.')
      .addResponse('house_story', 'ask_experiments', 'What kind of experiments?', 'experiment_details')
      .addNode('help_story', 'Find my husband\'s journal in the library. It contains the key to sealing away what he unleashed. But beware - the shadows have eyes.')
      .addResponse('help_story', 'accept_quest', 'I\'ll find it.', 'quest_accepted')
      .build();
    
    ladyGhost.dialogueTree = ghostDialogue;
    npcManager.addNPC(ladyGhost);

    // Malevolent Shadow Entity
    const shadowEntity = NPCFactory.createHostileMonster(
      'shadow_entity',
      'Writhing Shadow',
      { x: 65, y: 30, z: 0 } // In hidden study
    );
    shadowEntity.npcType = 'supernatural';
    shadowEntity.stats.strength = 20;
    shadowEntity.stats.health = 50;
    shadowEntity.description = 'A mass of writhing darkness that seems to absorb light itself. Red eyes gleam from within the inky blackness, and whispers in forgotten languages emanate from its form.';
    shadowEntity.hostileToFactions = ['players', 'living'];
    npcManager.addNPC(shadowEntity);

    // Child Ghost in Guest Bedroom
    const childGhost = NPCFactory.createFriendlyVillager(
      'child_ghost',
      'Emma\'s Spirit',
      { x: 45, y: 70, z: 0 }
    );
    childGhost.npcType = 'ghost';
    childGhost.description = 'The spirit of a young girl in a white nightgown. She clutches a porcelain doll and seems to be playing an eternal game of hide-and-seek.';
    
    const childDialogue = new (require('./npc-system').DialogueBuilder)('child_ghost_chat', 'Conversation with Emma')
      .addNode('greeting', 'Will you play with me? I\'ve been waiting so long for someone to play with...', true)
      .addResponse('greeting', 'yes_play', 'Of course! What game?', 'play_response')
      .addResponse('greeting', 'ask_parents', 'Where are your parents?', 'parents_response')
      .addNode('play_response', 'Hide and seek! But be careful... some things in this house don\'t like to be found.')
      .addResponse('play_response', 'agree', 'I\'ll be careful.', null)
      .build();
    
    childGhost.dialogueTree = childDialogue;
    npcManager.addNPC(childGhost);

    this.houseNPCs.set('lady_ghost', ladyGhost);
    this.houseNPCs.set('shadow_entity', shadowEntity);
    this.houseNPCs.set('child_ghost', childGhost);

    console.log('👻 Supernatural entities added to Ravencroft Manor');
  }

  /**
   * Get available movement options from a room
   */
  getVerticalMovementOptions(roomId: string): string[] {
    return this.verticalNav.getMovementOptions(roomId);
  }

  /**
   * Attempt vertical movement
   */
  attemptVerticalMovement(
    playerId: string,
    connectionId: string,
    playerInventory: any[] = [],
    playerStats: any = {},
    playerHealth: number = 100
  ) {
    return this.verticalNav.attemptMovement(playerId, connectionId, playerInventory, playerStats, playerHealth);
  }

  /**
   * Get narrative description of current supernatural activity
   */
  getSupernaturalActivity(roomId: string): string[] {
    const activities: string[] = [];
    const room = this.houseRooms.get(roomId);
    if (!room) return activities;

    // Random supernatural events based on room and time
    const events = this.generateSupernaturalEvents(roomId);
    return events;
  }

  private generateSupernaturalEvents(roomId: string): string[] {
    const events: string[] = [];
    const eventChance = this.config.difficulty === 'hard' ? 0.7 : 0.4;
    
    if (Math.random() < eventChance) {
      const roomEvents: { [key: string]: string[] } = {
        'entry_hall': [
          'The chandelier sways gently without any wind.',
          'You hear footsteps on the stairs, but see no one.',
          'A cold draft passes through the room, and you smell roses - long dead roses.'
        ],
        'drawing_room': [
          'The eyes in the portraits follow your movement.',
          'Sheet-covered furniture shifts as if someone just stood up.',
          'You hear the faint sound of a piano playing a melancholy tune.'
        ],
        'kitchen': [
          'The scent of baking bread fills the air from the cold oven.',
          'Pots and pans clatter softly as if someone is cooking.',
          'You glimpse a shadowy figure kneading dough, but it vanishes when you look directly.'
        ],
        'library': [
          'Books occasionally fall from shelves on their own.',
          'You hear the scratch of a quill pen writing.',
          'Pages turn by themselves in an open book on the desk.'
        ],
        'master_bedroom': [
          'The bed appears to have been recently slept in.',
          'You hear the soft sound of someone weeping.',
          'The vanity mirror shows a woman brushing her hair behind you.'
        ],
        'attic': [
          'The rocking chair rocks gently by itself.',
          'You hear children\'s laughter from empty corners.',
          'Old photographs in frames show people who weren\'t there before.'
        ],
        'wine_cellar': [
          'Wine bottles glow faintly in the darkness.',
          'You hear liquid sloshing in apparently empty bottles.',
          'Strange symbols on the walls seem to writhe when you\'re not looking directly.'
        ]
      };

      const possibleEvents = roomEvents[roomId] || ['You feel a supernatural presence watching you.'];
      events.push(possibleEvents[Math.floor(Math.random() * possibleEvents.length)]);
    }

    return events;
  }

  /**
   * Create a dummy state manager if none provided
   */
  private createDummyStateManager(): any {
    return {
      getPlayerState: () => ({ currentRoomId: 'entry_hall' }),
      movePlayerToRoom: () => true,
      recordEvent: () => {}
    };
  }

  /**
   * Get house completion status
   */
  getCompletionStatus(): {
    roomsExplored: number;
    totalRooms: number;
    secretsFound: number;
    totalSecrets: number;
    ghostsEncountered: string[];
    questsCompleted: string[];
  } {
    return {
      roomsExplored: this.houseRooms.size,
      totalRooms: this.houseRooms.size,
      secretsFound: this.secretsDiscovered.size,
      totalSecrets: this.config.enableSecretRooms ? 2 : 0,
      ghostsEncountered: Array.from(this.houseNPCs.keys()).filter(id => id.includes('ghost')),
      questsCompleted: []
    };
  }
}