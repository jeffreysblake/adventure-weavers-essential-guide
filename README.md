# The Quest Weaver's Essential Guide

## The Story Behind The Quest Weaver

This project began during a period of remote work where I found myself traveling for several months, missing the joy of reading stories aloud to my nephews every week. As a child, I had countless adventures with text-based games that sparked my imagination and creativity. Wanting to recreate those experiences for my own nephews, I drew inspiration from Neal Stephenson's "The Diamond Age: Or, A Young Lady's Illustrated Primer" - a work that explores how interactive narratives can be crafted through technology.

I set out to build a text-based game engine that would let kids have the same kind of immersive storytelling experiences I enjoyed as a child. The goal was to create something flexible enough for both parents and children to contribute their own ideas, while maintaining some core elements that make stories memorable.

The original vision required technologies that weren't available at the time - but now, in the age of "vibe coding" where context is everything, I've "uplifted" this codebase with modern technologies. 

## What This Engine Provides

I've transformed The Quest Weaver's Essential Guide into a powerful platform for creating interactive, text-based adventures tailored to your family's unique stories and preferences. The engine combines:

- **Flexible Storytelling**: Create immersive narratives that adapt to player choices
- **Smart Content Generation**: AI-powered content creation using OpenAI or Anthropic models  
- **Rich Physics System**: Realistic material interactions and spell effects
- **Modular Architecture**: Easily extendable with new features and capabilities

This is more than just a game engine - it's a tool for families to create meaningful, interactive experiences together. Whether you're looking to build educational adventures, entertaining stories, or collaborative gameplay, The Quest Weaver provides the foundation for creating something truly special.

## Core Features

1. **Entity Management System**
   - Base entity interface with common properties (id, name, position, type)
   - In-memory entity service with CRUD operations
   - Modular architecture with dependency injection

2. **Spatial Relationship System**
   - Natural language object placement: `on_top_of`, `inside`, `next_to`, `underneath`, `attached_to`
   - Smart placement constraints and validation
   - Container system with capacity limits and open/closed states
   - Automatic spatial descriptions: "The iron sword lies on the wooden desk"

3. **Physics Engine**
   - **12 Material Types**: wood, metal, stone, water, cloth, glass, leather, paper, organic, crystal, ice, gas
   - **Material Properties**: density, conductivity, flammability, brittleness, resistances
   - **7 Effect Types**: fire, lightning, ice, force, poison, acid, magic
   - **Realistic Interactions**: Fire burns wood, lightning conducts through metal, force shatters glass
   - **Chain Reactions**: Effects propagate through connected objects based on material properties

4. **Room Management**
   - Room creation with dimensions and environmental properties
   - Player and object placement within rooms
   - Spatial relationship tracking between entities

5. **Player System**
   - Player creation with health, inventory, level, experience
   - Comprehensive interaction system: examine, take, open/close, use
   - **Magic System**: Cast targeted spells and area-of-effect spells
   - **Spell Types**: Fireball, Lightning Bolt, Ice Shard, Force Push, Poison Cloud, Acid Splash, Magic Missile

6. **Object System**
   - Object creation with types (items, furniture, weapons, containers, consumables)
   - Material properties and physics interactions
   - Container mechanics with capacity limits and locking
   - Object state management (open/closed, locked/unlocked, on fire, frozen, etc.)

## API Endpoints

### Rooms
- `POST /rooms` - Create a new room
- `GET /rooms/:id` - Get a specific room
- `PATCH /rooms/:id/players/:playerId` - Add player to room
- `PATCH /rooms/:id/objects/:objectId` - Add object to room

### Players
- `POST /players` - Create a new player
- `GET /players/:id` - Get a specific player
- `PATCH /players/:id/inventory` - Add item to player inventory

### Objects
- `POST /objects` - Create a new object
- `GET /objects/:id` - Get a specific object

## Physics Examples

The physics engine enables realistic magical interactions:

### Fire Magic
- **Fireball hits wooden chest with potions** → Chest catches fire, potions explode, nearby objects take force damage
- **Fireball hits stone door** → Stone resists fire, minimal damage
- **Fireball hits gas canister** → Heat ignites explosive contents, creating chain explosion

### Lightning Magic
- **Lightning bolt hits water puddle** → Electricity conducts through water, electrocuting anyone standing in it
- **Lightning bolt hits metal sword on metal chest** → Electricity chains through connected metal objects
- **Lightning bolt hits glass window** → Glass resists electricity, no conduction

### Force Magic
- **Force push on glass bottle** → Brittle glass shatters instantly
- **Force push on wooden chest** → Takes damage based on force intensity vs. material strength

### Ice Magic
- **Ice shard hits water barrel** → Water freezes solid, becomes brittle
- **Ice shard hits any object** → Object becomes brittle and vulnerable to force damage

## Getting Started

1. Install dependencies:
   ```bash
   cd nestjs-app
   npm install
   ```

2. Run the development server:
   ```bash
   npm run start:dev
   ```

3. Test with sample requests:
   ```bash
   # Create a room
   curl -X POST http://localhost:3000/rooms \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Room","width":10,"height":10}'

   # Create a player
   curl -X POST http://localhost:3000/players \
     -H "Content-Type: application/json" \
     -d '{"name":"Hero","health":100}'
     
   # Create a wooden chest
   curl -X POST http://localhost:3000/objects \
     -H "Content-Type: application/json" \
     -d '{"name":"wooden chest","objectType":"container","isContainer":true,"materialProperties":{"material":"wood","flammability":8}}'
   ```

## Testing

Run the full test suite (47 tests):
```bash
cd nestjs-app
npm run test
```

### Test Categories
- **Unit Tests**: Individual service and controller tests
- **Integration Tests**: Cross-service functionality 
- **Game Scenarios**: Complete room setups with player interactions
- **Physics Scenarios**: Material interactions and spell effects

```bash
# Run specific test categories
npm test game-scenario.spec.ts      # Complete gameplay scenarios
npm test physics-scenario.spec.ts   # Physics and magic interactions
```

## AI Integration

The Quest Weaver engine supports integration with AI models to help create and manage your games. You can use either OpenAI or Anthropic models for enhanced capabilities.

### Configuration

To enable AI features, set the following environment variables:

```bash
# For OpenAI
export OPENAI_API_KEY="your-openai-api-key"
export OPENAI_MODEL="gpt-4o-mini"

# For Anthropic  
export ANTHROPIC_API_KEY="your-anthropic-api-key"
export ANTHROPIC_MODEL="claude-3-haiku-20240307"
```

### Features

When configured with AI models, the engine provides:

1. **Automated Game Creation** - Generate rooms, objects, and NPCs using natural language prompts
2. **Smart Content Generation** - Create detailed game content based on your specifications  
3. **Context-Aware Narratives** - Generate immersive storytelling that adapts to player actions
4. **Physics-Based Interactions** - AI-powered simulation of realistic material interactions

### Usage Examples

```bash
# Create a room with AI assistance
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{"name":"Mystic Forest","description":"A magical forest with glowing plants"}'

# Generate an object using AI
curl -X POST http://localhost:3000/objects \
  -H "Content-Type: application/json" \
  -d '{"name":"Enchanted Sword","objectType":"weapon","materialProperties":{"material":"metal"}}'
```

The engine will automatically use the configured AI provider for content generation when available.