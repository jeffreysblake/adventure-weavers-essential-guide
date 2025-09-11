const { NLPProcessor } = require('./src/lib/nlp-processor');

console.log('Testing NLP processor take variations:');
const inputs = ['take lamp', 'grab lamp', 'get the lamp', 'pick up the lamp'];

inputs.forEach(input => {
  const processed = NLPProcessor.processInput(input);
  const parsed = NLPProcessor.parseCommand(processed);
  console.log(`"${input}" -> processed: "${processed}" -> action: ${parsed.action}, objects: [${parsed.objects.join(', ')}]`);
});