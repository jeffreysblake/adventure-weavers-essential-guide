# Example Usage

Here's how you can set up and test your Quest Weaver environment:

## 1. Create a Room

```bash
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Forest Clearing",
    "width": 20,
    "height": 20,
    "environment": {
      "lighting": "dawn",
      "sound": "birds"
    }
  }'
```

## 2. Create Players

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hero",
    "health": 100,
    "level": 1
  }'

curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Villager",
    "health": 100,
    "level": 1
  }'
```

## 3. Create Objects

```bash
curl -X POST http://localhost:3000/objects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sword",
    "objectType": "weapon",
    "properties": {
      "weight": 2.5,
      "value": 100
    }
  }'
```

## 4. Add Entities to Room

```bash
# Add player to room
curl -X PATCH http://localhost:3000/rooms/{roomId}/players/{playerId}

# Add object to room  
curl -X PATCH http://localhost:3000/rooms/{roomId}/objects/{objectId}
```

## 5. Test Interactions

Once you have players and objects in a room, you can test interactions:
- Players can pick up objects
- Objects can be used by players
- Rooms can change environment based on player actions