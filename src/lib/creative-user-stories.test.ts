import { GameSystems } from './game-systems';

describe('Creative User Stories Test', () => {
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Initialize the complete game systems
    gameSystems = new GameSystems();
  });
  
  it('should handle a fairy tale adventure - Cinderella Quest', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    const navigationSystem = gameSystems.getNavigationSystem();
    
    // Create rooms for Cinderella's quest
    const cottageRoom = roomSystem.createRoom(
      'cottage-1',
      'Cinderella\'s Cottage',
      'A small, cozy cottage with a warm fire.',
      'The cottage is filled with the scent of fresh bread and herbs. Cinderella works by the hearth.',
      { x: 0, y: 0 },
      { width: 15, height: 15 }
    );
    
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Enchanted Forest',
      'A magical forest with glowing mushrooms.',
      'The forest is alive with magic. You can hear whispers in the wind and see dancing lights.',
      { x: 20, y: 0 },
      { width: 30, height: 30 }
    );
    
    const palaceRoom = roomSystem.createRoom(
      'palace-1',
      'Royal Palace',
      'A grand palace with marble floors.',
      'The palace is filled with nobles and royalty. You can see a magnificent ballroom.',
      { x: 50, y: 0 },
      { width: 40, height: 40 }
    );
    
    // Create items
    const magicLamp = itemSystem.createItem(
      'lamp-1',
      'Magic Lamp',
      'A lamp that grants wishes'
    );
    
    const glassSlipper = itemSystem.createItem(
      'slipper-1',
      'Glass Slipper',
      'A beautiful slipper made of crystal'
    );
    
    // Connect rooms
    roomSystem.addConnection('cottage-1', 'forest-1', 'east');
    roomSystem.addConnection('forest-1', 'palace-1', 'east');
    
    // Verify the setup works correctly
    expect(roomSystem.getRoom('cottage-1').name).toBe('Cinderella\'s Cottage');
    expect(roomSystem.getRoom('palace-1').name).toBe('Royal Palace');
  });
  
  it('should handle a space exploration quest - Starship Odyssey', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create rooms for space adventure
    const bridgeRoom = roomSystem.createRoom(
      'bridge-1',
      'Starship Bridge',
      'A futuristic bridge with holographic displays.',
      'The bridge is filled with advanced technology. You can see stars streaming past the viewport.',
      { x: 0, y: 0 },
      { width: 25, height: 20 }
    );
    
    const engineRoom = roomSystem.createRoom(
      'engine-1',
      'Engine Room',
      'A large chamber with glowing reactors.',
      'The room is filled with humming energy. You can see the ship\'s core reactor.',
      { x: 25, y: 0 },
      { width: 30, height: 30 }
    );
    
    const alienRoom = roomSystem.createRoom(
      'alien-1',
      'Alien Planet',
      'A strange planet with purple vegetation.',
      'The planet is filled with mysterious creatures and glowing plants. You can hear strange sounds.',
      { x: 55, y: 0 },
      { width: 35, height: 35 }
    );
    
    // Create space items
    const hyperdrive = itemSystem.createItem(
      'hyperdrive-1',
      'Hyperdrive Core',
      'A powerful engine that allows faster-than-light travel'
    );
    
    const alienArtifact = itemSystem.createItem(
      'artifact-1',
      'Alien Artifact',
      'An ancient artifact from the alien civilization'
    );
    
    // Connect rooms
    roomSystem.addConnection('bridge-1', 'engine-1', 'south');
    roomSystem.addConnection('engine-1', 'alien-1', 'east');
    
    // Verify setup works correctly
    expect(roomSystem.getRoom('bridge-1').name).toBe('Starship Bridge');
    expect(roomSystem.getRoom('alien-1').name).toBe('Alien Planet');
  });
  
  it('should handle a fantasy quest - The Dragon\'s Hoard', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create rooms for dragon quest
    const villageRoom = roomSystem.createRoom(
      'village-1',
      'Village Square',
      'A bustling village square with merchants and townsfolk.',
      'The village is filled with activity. You can hear the sounds of daily life.',
      { x: 0, y: 0 },
      { width: 25, height: 25 }
    );
    
    const forestRoom = roomSystem.createRoom(
      'forest-1',
      'Dark Forest',
      'A dark and mysterious forest.',
      'The forest is filled with ancient trees. You can hear strange sounds from the shadows.',
      { x: 25, y: 0 },
      { width: 30, height: 30 }
    );
    
    const caveRoom = roomSystem.createRoom(
      'cave-1',
      'Dragon\'s Cave',
      'A massive cave with glowing crystals.',
      'The cave is filled with the scent of dragon fire. You can see treasure scattered around.',
      { x: 55, y: 0 },
      { width: 35, height: 35 }
    );
    
    // Create fantasy items
    const sword = itemSystem.createItem(
      'sword-1',
      'Dragon Slayer Sword',
      'A legendary blade that can slay dragons'
    );
    
    const treasure = itemSystem.createItem(
      'treasure-1',
      'Dragon\'s Treasure',
      'A pile of gold and jewels'
    );
    
    // Connect rooms
    roomSystem.addConnection('village-1', 'forest-1', 'east');
    roomSystem.addConnection('forest-1', 'cave-1', 'south');
    
    // Verify setup works correctly
    expect(roomSystem.getRoom('village-1').name).toBe('Village Square');
    expect(roomSystem.getRoom('cave-1').name).toBe('Dragon\'s Cave');
  });
  
  it('should handle a mystery quest - The Detective\'s Case', () => {
    const roomSystem = gameSystems.getRoomSystem();
    const itemSystem = gameSystems.getItemSystem();
    
    // Create rooms for detective story
    const officeRoom = roomSystem.createRoom(
      'office-1',
      'Detective\'s Office',
      'A cluttered office with papers and files.',
      'The office is filled with case files. You can see a desk covered in documents.',
      { x: 0, y: 0 },
      { width: 20, height: 20 }
    );
    
    const crimeSceneRoom = roomSystem.createRoom(
      'crime-1',
      'Crime Scene',
      'A mysterious location with signs of a crime.',
      'The scene is filled with evidence. You can see footprints and strange symbols.',
      { x: 20, y: 0 },
      { width: 30, height: 30 }
    );
    
    const interrogationRoom = roomSystem.createRoom(
      'interrogation-1',
      'Interrogation Room',
      'A small room with a table and chairs.',
      'The room is filled with tension. You can see a suspect sitting across from you.',
      { x: 50, y: 0 },
      { width: 25, height: 25 }
    );
    
    // Create detective items
    const clue = itemSystem.createItem(
      'clue-1',
      'Mysterious Clue',
      'A strange object found at the crime scene'
    );
    
    const evidence = itemSystem.createItem(
      'evidence-1',
      'Crime Evidence',
      'Physical proof of the crime'
    );
    
    // Connect rooms
    roomSystem.addConnection('office-1', 'crime-1', 'east');
    roomSystem.addConnection('crime-1', 'interrogation-1', 'south');
    
    // Verify setup works correctly
    expect(roomSystem.getRoom('office-1').name).toBe('Detective\'s Office');
    expect(roomSystem.getRoom('interrogation-1').name).toBe('Interrogation Room');
  });
});