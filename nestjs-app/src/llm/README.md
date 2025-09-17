# The Quest Weaver's Essential Guide LLM Integration

## Overview

The Quest Weaver's Essential Guide LLM Integration provides intelligent AI-powered content generation, narrative adaptation, and conflict resolution for the game engine. This comprehensive system allows for dynamic story creation, intelligent NPC behavior, and seamless handling of impossible game states.

## Features

### 🤖 Core AI Services
- **Multi-Provider Support**: OpenAI GPT and Anthropic Claude integration with automatic fallback
- **Intelligent Caching**: Response caching with TTL management and cache optimization
- **Robust Error Handling**: Circuit breakers, retry logic, and user-friendly error messages
- **Template System**: Flexible prompt templates with variable validation

### 🏰 Content Generation
- **Room Generation**: Create immersive environments with objects, ambiance, and connections
- **NPC Creation**: Generate characters with personalities, dialogue, and behavioral patterns
- **Quest Generation**: Dynamic quest creation with objectives, rewards, and branching paths
- **Dialogue System**: Context-aware NPC conversations and interactions

### 📚 Story Creation
- **Agentic Workflows**: Interactive story creation with user decisions and feedback
- **Narrative Adaptation**: Real-time story adjustment based on player actions
- **Content Validation**: Quality assurance and consistency checking
- **Plot Development**: Dynamic plot twists and story progression

### ⚡ Conflict Resolution
- **Physics Conflicts**: Handle impossible object states and spatial contradictions
- **NPC Behavior**: Resolve impossible or contradictory NPC actions
- **World Consistency**: Maintain narrative and logical consistency
- **Smart Recovery**: Intelligent fallback solutions with narrative explanations

## Architecture

```
LLMModule
├── Services/
│   ├── LLMService (Core orchestration)
│   ├── PromptTemplateService (Template management)
│   ├── ContextBuilderService (Game state serialization)
│   ├── NarrativeGeneratorService (Story creation)
│   ├── RoomGeneratorService (Environment generation)
│   ├── NPCGeneratorService (Character creation)
│   ├── StoryAgentService (Agentic workflows)
│   ├── ConflictResolverService (Problem resolution)
│   ├── LLMCacheService (Performance optimization)
│   └── LLMErrorHandlerService (Reliability)
├── Providers/
│   ├── OpenAIProvider (GPT integration)
│   └── AnthropicProvider (Claude integration)
└── Controller/
    └── LLMController (REST API endpoints)
```

## Quick Start

### 1. Configuration

Set environment variables:

```bash
# Primary provider (choose one or both)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional configuration
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_MODEL=claude-3-haiku-20240307
LLM_TIMEOUT=30000
LLM_MAX_RETRIES=3
```

### 2. Basic Usage

```typescript
// Inject the service
constructor(private llmService: LLMService) {}

// Generate text
const response = await this.llmService.generateResponse(
  'Describe a magical forest',
  { temperature: 0.8, maxTokens: 200 }
);

// Generate structured content
const npc = await this.npcGenerator.generateNPC({
  role: 'merchant',
  personality: ['friendly', 'talkative'],
  location: 'market_square'
});
```

### 3. REST API Endpoints

The system exposes comprehensive REST API endpoints:

```bash
# Check system status
GET /api/llm/status

# Generate content
POST /api/llm/generate/text
POST /api/llm/generate/structured
POST /api/llm/generate/room
POST /api/llm/generate/npc
POST /api/llm/generate/quest

# Story creation
POST /api/llm/story/create
POST /api/llm/story/decision/{sessionId}
GET /api/llm/story/status/{sessionId}

# Conflict resolution
POST /api/llm/conflict/resolve
POST /api/llm/conflict/physics
POST /api/llm/conflict/npc

# Template management
GET /api/llm/templates
GET /api/llm/templates/{templateId}
POST /api/llm/templates/{templateId}/compile
```

## API Documentation

### Content Generation

#### Generate Room
Create immersive game environments with AI assistance.

```typescript
POST /api/llm/generate/room
{
  "theme": "ancient library",
  "style": "fantasy",
  "size": "large",
  "purpose": "knowledge repository",
  "requiredObjects": ["ancient tome", "reading desk"],
  "dangerLevel": 2
}
```

#### Generate NPC
Create dynamic characters with personalities and backstories.

```typescript
POST /api/llm/generate/npc
{
  "name": "Sage Eldaran",
  "role": "wizard",
  "personality": ["wise", "mysterious", "helpful"],
  "backstory": "Ancient keeper of forgotten knowledge",
  "level": 15,
  "alignment": "good"
}
```

#### Generate Dialogue
Create contextual NPC conversations.

```typescript
POST /api/llm/generate/dialogue/{npcId}
{
  "topic": "ancient magic",
  "context": {
    "playerId": "player_123",
    "roomId": "library_main",
    "situation": "seeking knowledge"
  }
}
```

### Story Creation

#### Start Story Creation
Begin an interactive story creation session.

```typescript
POST /api/llm/story/create
{
  "theme": "Lost civilization mystery",
  "genre": "mystery",
  "playerLevel": 5,
  "preferences": {
    "complexity": "moderate",
    "length": "medium",
    "focusAreas": ["exploration", "puzzle-solving"]
  }
}
```

#### Process Story Decision
Continue story creation by making decisions.

```typescript
POST /api/llm/story/decision/{sessionId}
{
  "decisionId": "world_building_approach",
  "choice": "location_first",
  "feedback": "I prefer to start with interesting locations"
}
```

### Conflict Resolution

#### Resolve Physics Conflict
Handle impossible object states or physics violations.

```typescript
POST /api/llm/conflict/physics
{
  "objects": ["sword_123", "stone_wall_456"],
  "physicsError": "Sword embedded in indestructible wall",
  "location": "ancient_ruins"
}
```

#### Resolve NPC Conflict
Handle impossible or contradictory NPC behaviors.

```typescript
POST /api/llm/conflict/npc
{
  "npcId": "guard_789",
  "conflictDescription": "Guard trying to patrol through locked door",
  "attemptedAction": "patrol_route_alpha",
  "location": "castle_courtyard"
}
```

## Advanced Features

### Template System

Create and manage reusable prompt templates:

```typescript
// Register custom template
const template: PromptTemplate = {
  id: 'custom_item_generator',
  name: 'Custom Item Generator',
  category: 'generation',
  template: 'Generate a {{item_type}} for {{setting}} with {{rarity}} rarity',
  variables: [
    { name: 'item_type', type: 'string', required: true },
    { name: 'setting', type: 'string', required: true },
    { name: 'rarity', type: 'string', required: false, defaultValue: 'common' }
  ],
  systemPrompt: 'You are a game item designer.',
  outputFormat: 'json'
};

promptService.registerTemplate(template);
```

### Caching Optimization

The system includes intelligent caching for performance:

```typescript
// Cache statistics
const stats = cacheService.getStats();
console.log(`Cache hit rate: ${stats.hitRate * 100}%`);

// Manual cache operations
await cacheService.set('custom_key', response, 3600000); // 1 hour TTL
const cached = await cacheService.get('custom_key');

// Cache invalidation
await cacheService.invalidate('room_generation');
```

### Error Handling

Comprehensive error handling with user-friendly messages:

```typescript
// Custom retry configuration
const customRetry = await errorHandler.withRetry(
  async () => await riskyOperation(),
  {
    maxRetries: 5,
    baseDelay: 2000,
    backoffFactor: 1.5,
    retryableErrors: ['timeout', 'rate_limit']
  }
);

// Circuit breaker for unreliable operations
const circuitBreaker = errorHandler.createCircuitBreaker(
  () => unreliableService.call(),
  {
    failureThreshold: 3,
    resetTimeout: 60000,
    monitoringPeriod: 300000
  }
);
```

## Performance Considerations

### Response Times
- Cached responses: ~5ms
- Simple generation: 500-2000ms
- Complex story creation: 2-10 seconds
- Conflict resolution: 1-5 seconds

### Rate Limits
- OpenAI: Varies by plan (typically 3000 RPM)
- Anthropic: Varies by plan (typically 1000 RPM)
- Built-in retry logic handles rate limiting automatically

### Caching Strategy
- Template compilations: 10 minutes TTL
- Simple responses: 1 hour TTL
- Generated content: 2-4 hours TTL
- Story sessions: Session-based TTL

## Testing

Comprehensive test coverage includes:

```bash
# Run LLM-specific tests
npm test -- --testPathPattern=llm

# Integration tests
npm test -- llm.integration.spec.ts

# Unit tests for individual services
npm test -- llm.service.spec.ts
npm test -- prompt-template.service.spec.ts
npm test -- conflict-resolver.service.spec.ts
```

## Troubleshooting

### Common Issues

1. **No API Keys Configured**
   - Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` environment variables
   - Restart the application after setting keys

2. **Rate Limiting**
   - Built-in retry logic handles most cases
   - Consider upgrading API plan for higher limits
   - Monitor rate limit headers in logs

3. **Cache Issues**
   - Clear cache: `POST /api/llm/cache/clear`
   - Check cache statistics: `GET /api/llm/status`
   - Adjust TTL values if needed

4. **Template Errors**
   - Validate template variables match requirements
   - Check template compilation: `POST /api/llm/templates/{id}/compile`
   - Review template variable types and constraints

### Debug Logs

Enable debug logging:

```bash
DEBUG=quest-weaver:llm* npm run start:dev
```

### Health Monitoring

```typescript
// Check system health
const isHealthy = errorHandler.isSystemHealthy();
const stats = llmService.getStats();

if (!isHealthy || stats.successRate < 0.9) {
  console.warn('LLM system experiencing issues');
}
```

## Contributing

When extending the LLM integration:

1. **New Providers**: Implement the `LLMProvider` interface
2. **New Templates**: Follow the template schema and validation patterns
3. **New Services**: Integrate with caching and error handling
4. **New Endpoints**: Add comprehensive error handling and input validation

## License

This LLM integration is part of The Quest Weaver's Essential Guide project and follows the same licensing terms.