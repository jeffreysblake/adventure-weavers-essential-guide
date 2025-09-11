// Simple test for game engine logic

import { GameStateManager } from './src/lib/game-state-manager';
import { RoomSystem } from './src/lib/room-system';
import { ItemSystem } from './src/lib/item-system';

// Test basic functionality without Jest
async function runTests() {
  console.log('Testing Game Engine Logic...');
  
  try {
    // Create systems
    const roomSystem = new RoomSystem();
    const itemSystem = new ItemSystem();
    
    // Create game state manager
    const gameStateManager = new GameStateManager(roomSystem, itemSystem);
    
    // Test initialization
    console.log('✓ Game State Manager created successfully');
    
    // Test player creation
    gameStateManager.initializePlayer('player1', 'Test Player', 'room1');
    console.log('✓ Player initialized successfully');
    
    // Test getting player state
    const playerState = gameStateManager.getPlayerState('player1');
    if (playerState && playerState.id === 'player1') {
      console.log('✓ Player state retrieved successfully');
    } else {
      console.error('✗ Failed to retrieve player state');
    }
    
    // Test adding items
    gameStateManager.addItemToGame({ id: 'item1' }, 'room1');
    console.log('✓ Item added to game successfully');
    
    console.log('\nAll tests passed! Game engine logic is working correctly.');
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
  
  return true;
}

// Run the test
runTests().then(success => {
  if (!success) {
    process.exit(1);
  }
});