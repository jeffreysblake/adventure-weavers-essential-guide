'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-6xl py-6 px-4 mb-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Interactive Story Engine</h1>
        <p className="text-lg text-gray-600 mt-2">Physics, Component System & Auto-generation Features</p>
      </header>

      <main className="flex flex-col items-center w-full max-w-6xl">
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Game Engine Core</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Use PixiJS for 2D rendering (better performance than HTML Canvas)</li>
            <li>Implement a component-based system using ECS pattern</li>
            <li>Physics with Matter.js or Cannon.js</li>
          </ul>
        </div>

        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Auto-generation Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Image generation with TensorFlow.js or Hugging Face models</li>
            <li>Text generation with OpenAI API integration or local LLMs</li>
          </ul>
        </div>

        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration Management</h2>
          <p className="text-gray-600 mb-4">YAML/JSON configuration files for easy customization:</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {`{
  "gameSettings": {
    "physicsEnabled": true,
    "renderingEngine": "PixiJS",
    "imageGeneration": {
      "enabled": true
    }
  }
}`}
          </pre>
        </div>

        <div className="w-full bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Component System Demo</h2>
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => setCount(count + 1)}
              variant="primary"
              size="md"
            >
              Count: {count}
            </Button>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl py-6 px-4 mt-8 border-t border-gray-200 text-center text-gray-500">
        <p>Interactive Story Engine with Physics, Component System & Auto-generation</p>
      </footer>
    </div>
  );
}