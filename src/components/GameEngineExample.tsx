import React, { useState } from 'react';
import { GameSystems } from '../lib/game-systems';

const GameEngineExample: React.FC = () => {
  const [gameSystems] = useState<GameSystems>(new GameSystems());
  
  // Initialize our game systems with some sample data
  const initializeGame = () => {
    // Create rooms
    const roomSystem = gameSystems.getRoomSystem();
    
    // Create a starting room
    const startRoom = roomSystem.createRoom(
      'start-room',
      'Village Square',
      'A peaceful village square surrounded by houses and shops.',
      { x: 0, y: 0 },
      { width: 200, height: 200 }
    );
    
    // Create a second room
    const forestRoom = roomSystem.createRoom(
      'forest-room',
      'Enchanted Forest',
      'A mysterious forest with glowing mushrooms and ancient trees.',
      { x: 100, y: 0 },
      { width: 200, height: 200 }
    );
    
    // Add connections between rooms
    roomSystem.addConnection('start-room', 'forest-room', 'east');
    roomSystem.addConnection('forest-room', 'start-room', 'west');
    
    // Create items in the forest
    const itemSystem = gameSystems.getItemSystem();
    
    const magicPotion = itemSystem.createItem(
      'magic-potion',
      'Magic Potion',
      'A glowing potion that restores health and mana.',
      'consumable'
    );
    
    const sword = itemSystem.createItem(
      'sword-of-light',
      'Sword of Light',
      'A legendary blade that glows with pure light.',
      'weapon'
    );
    
    // Add items to the forest room
    // Note: In a real implementation, we'd need to track which rooms contain which items
    
    // Create player
    const navigationSystem = gameSystems.getNavigationSystem();
    const player = navigationSystem.createPlayer(
      'player1',
      'Hero',
      'start-room'
    );
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Game Engine Example</h2>
      <p className="mb-4">
        This demonstrates how the Quest Weaver game engine components work together:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-4">
        <li>Room System - Manages rooms with relative positioning and connections</li>
        <li>Item System - Handles items in rooms and player inventory</li>
        <li>Navigation System - Controls player movement between rooms</li>
      </ul>
      
      <button 
        onClick={initializeGame}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Initialize Game
      </button>
    </div>
  );
};

export default GameEngineExample;