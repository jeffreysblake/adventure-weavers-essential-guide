import { NLPProcessor } from './nlp-processor';
import { CommandParser } from './command-parser';
import { GameSystems } from './game-systems';

describe('NLP Debug Tests', () => {
  it('should debug NLP processing', () => {
    const testInputs = [
      "take lamp",
      "I want to take the lamp", 
      "can I take the lamp?",
      "pick up the lamp"
    ];

    console.log('Testing NLP Processor:');
    testInputs.forEach(input => {
      const processed = NLPProcessor.processInput(input);
      const parsed = NLPProcessor.parseCommand(processed);
      console.log(`"${input}" -> processed: "${processed}" -> action: ${parsed.action}, objects: [${parsed.objects.join(', ')}]`);
    });

    // Test command parser
    console.log('\nTesting Command Parser:');
    const gameSystems = new GameSystems();
    const commandParser = new CommandParser(gameSystems);

    testInputs.forEach(input => {
      const result = commandParser.parseCommand(input);
      console.log(`"${input}" -> action: ${result?.action}, item: ${result?.item}, confidence: ${result?.confidence}`);
    });
  });
});