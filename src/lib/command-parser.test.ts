import { CommandParser } from './command-parser';
import { GameSystems } from './game-systems';
import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';


describe('CommandParser', () => {
  let commandParser: CommandParser;
  let gameSystems: GameSystems;
  
  beforeEach(() => {
    // Create a minimal mock of the systems needed for testing
    const roomSystem = new RoomSystem();
    const itemSystem = new ItemSystem();
    gameSystems = new GameSystems();
    commandParser = new CommandParser(gameSystems);
  });
  
  it('should parse a move command', () => {
    const result = commandParser.parseCommand("I want to go north");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('move');
      expect(result.direction).toBe('north');
    }
  });
  
  it('should parse a use command', () => {
    const result = commandParser.parseCommand("I want to use potion");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('use');
      expect(result.item).toBe('potion');
    }
  });
  
  it('should parse an open command', () => {
    const result = commandParser.parseCommand("I want to open chest");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('open');
      expect(result.item).toBe('chest');
    }
  });
  
  it('should parse a take command', () => {
    const result = commandParser.parseCommand("I want to take sword");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('take');
      expect(result.item).toBe('sword');
    }
  });
  
  it('should parse a throw command', () => {
    const result = commandParser.parseCommand("I want to throw potion at brambles");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('throw');
      expect(result.item).toBe('potion');
      expect(result.target).toBe('brambles');
    }
  });
  
  it('should parse a look command', () => {
    const result = commandParser.parseCommand("look");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('look');
    }
  });
  
  it('should parse an inventory command', () => {
    const result = commandParser.parseCommand("inventory");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('inventory');
    }
  });
  
  it('should parse a help command', () => {
    const result = commandParser.parseCommand("help");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.action).toBe('help');
    }
  });
});