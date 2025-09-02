# Quest Weaver - Game Engine

This is a comprehensive game engine built using NestJS for managing rooms, players, and objects in a text-based adventure environment with integrated physics and magic systems.

## Features Implemented

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