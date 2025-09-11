import { NLPProcessor } from './src/lib/nlp-processor';
import { CommandParser } from './src/lib/command-parser';
import { GameSystems } from './src/lib/game-systems';

// Test NLP processing
console.log('Testing NLP Processor:');
const testInputs = [
  "take lamp",
  "I want to take the lamp", 
  "can I take the lamp?",
  "pick up the lamp"
];

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