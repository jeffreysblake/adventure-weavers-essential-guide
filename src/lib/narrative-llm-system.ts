/**
 * Narrative LLM System for Quest Weaver
 * Framework for integrating with local LLMs to generate dynamic narratives,
 * room descriptions, NPC dialogue, and quest logic
 */

export interface LLMConfig {
  endpoint?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  apiKey?: string;
}

export interface GameContext {
  currentRoom: {
    id: string;
    name: string;
    description: string;
    items: any[];
    npcs: any[];
    connections: { [direction: string]: string };
    verticalConnections?: { [direction: string]: string };
  };
  player: {
    id: string;
    name: string;
    position: { x: number; y: number; z: number };
    health: number;
    level: number;
    inventory: any[];
    stats: any;
    recentActions: string[];
  };
  gameState: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight';
    weather?: string;
    mood?: 'tense' | 'mysterious' | 'peaceful' | 'dangerous' | 'magical';
    recentEvents: any[];
    questProgress: any;
  };
  narrative: {
    theme?: 'horror' | 'fantasy' | 'mystery' | 'adventure' | 'sci-fi';
    tone?: 'dark' | 'light' | 'serious' | 'humorous' | 'epic';
    setting?: string;
    era?: string;
  };
}

export interface LLMPrompt {
  type: 'room_description' | 'npc_dialogue' | 'item_description' | 'action_result' | 'quest_logic' | 'narrative_choice' | 'environment_change';
  context: GameContext;
  specificPrompt: string;
  constraints?: {
    maxLength?: number;
    style?: string;
    includeOptions?: boolean;
    mustInclude?: string[];
    mustAvoid?: string[];
  };
  examples?: string[];
}

export interface LLMResponse {
  success: boolean;
  content: string;
  metadata?: {
    tokens_used?: number;
    processing_time?: number;
    confidence?: number;
    model_used?: string;
  };
  structuredData?: {
    choices?: string[];
    consequences?: { [choice: string]: any };
    newItems?: any[];
    newNPCs?: any[];
    stateChanges?: any;
  };
  error?: string;
}

export class NarrativeLLMSystem {
  private config: LLMConfig;
  private promptTemplates: Map<string, string> = new Map();
  private responseCache: Map<string, LLMResponse> = new Map();
  private rateLimitTracker: Map<string, number[]> = new Map();
  
  constructor(config: LLMConfig = {}) {
    this.config = {
      endpoint: config.endpoint || 'http://localhost:11434/api/generate', // Ollama default
      model: config.model || 'llama3.1',
      maxTokens: config.maxTokens || 500,
      temperature: config.temperature || 0.7,
      timeout: config.timeout || 30000,
      ...config
    };
    
    this.initializePromptTemplates();
  }

  /**
   * Initialize standard prompt templates for different narrative generation types
   */
  private initializePromptTemplates(): void {
    // Room Description Template
    this.promptTemplates.set('room_description', `
You are a master storyteller creating immersive room descriptions for a text-based adventure game.

GAME CONTEXT:
- Current Room: {roomName}
- Theme: {theme}
- Tone: {tone}
- Time: {timeOfDay}
- Player Level: {playerLevel}
- Recent Events: {recentEvents}

ROOM DATA:
- Items present: {items}
- NPCs present: {npcs}
- Connections: {connections}

TASK: Create a vivid, atmospheric description of this room that:
1. Sets the mood appropriate to the {tone} tone and {theme} theme
2. Mentions key items and NPCs naturally within the description
3. Hints at available exits without being too obvious
4. Includes sensory details (sight, sound, smell, touch)
5. Stays under 200 words
6. Maintains consistency with the overall narrative

CONSTRAINTS:
- Write in second person ("You see...")
- Match the {tone} tone exactly
- Include subtle environmental storytelling
- Don't break immersion with game mechanics

Generate the room description now:`);

    // NPC Dialogue Template
    this.promptTemplates.set('npc_dialogue', `
You are generating dialogue for an NPC in a text-based adventure game.

NPC CONTEXT:
- Name: {npcName}
- Type: {npcType}
- Personality: {personality}
- Current State: {currentState}
- Faction: {faction}
- Recent Events: {recentEvents}

CONVERSATION CONTEXT:
- Player Action: {playerAction}
- Location: {roomName}
- Relationship with Player: {relationship}
- Previous Dialogue: {previousDialogue}

TASK: Generate appropriate dialogue that:
1. Matches the NPC's personality and current emotional state
2. Responds naturally to the player's action
3. Advances the story or provides useful information
4. Includes 2-4 response options for the player
5. Stays in character consistently

FORMAT:
NPC Response: [The NPC's spoken dialogue]
Player Options:
1. [First response option]
2. [Second response option]
3. [Third response option]
4. [Fourth response option - optional]

Generate the dialogue now:`);

    // Action Result Template
    this.promptTemplates.set('action_result', `
You are describing the results of a player action in a text-based adventure game.

ACTION CONTEXT:
- Player Action: {playerAction}
- Target: {target}
- Location: {roomName}
- Player Stats: {playerStats}
- Success/Failure: {outcome}

GAME STATE:
- Theme: {theme}
- Tone: {tone}
- Current Mood: {mood}

TASK: Describe the result of this action in a way that:
1. Clearly communicates success or failure
2. Matches the game's tone and atmosphere
3. Includes appropriate consequences or rewards
4. Advances the narrative naturally
5. Provides clear feedback to the player

CONSTRAINTS:
- Keep under 100 words
- Write in second person
- Include sensory details when appropriate
- Maintain narrative consistency

Generate the action result description now:`);

    // Quest Logic Template
    this.promptTemplates.set('quest_logic', `
You are a quest designer creating dynamic quest content for a text-based adventure game.

QUEST CONTEXT:
- Current Objective: {currentObjective}
- Player Progress: {playerProgress}
- Available Items: {playerInventory}
- Location: {roomName}
- NPCs Present: {npcs}

GAME STATE:
- Theme: {theme}
- Difficulty: {difficulty}
- Player Level: {playerLevel}

TASK: Generate quest logic that includes:
1. Next objective or step
2. Success conditions
3. Failure conditions
4. Rewards for completion
5. Hints for the player

FORMAT:
Next Objective: [Clear description of what player should do next]
Success Conditions: [What needs to happen for success]
Hint: [Subtle guidance for the player]
Reward: [What the player gets for success]
Consequences: [What happens if they fail]

Generate the quest logic now:`);

    // Environment Change Template
    this.promptTemplates.set('environment_change', `
You are describing environmental changes in a text-based adventure game.

CHANGE CONTEXT:
- Trigger Event: {triggerEvent}
- Location: {roomName}
- Change Type: {changeType}
- Intensity: {intensity}

GAME STATE:
- Theme: {theme}
- Tone: {tone}
- Time: {timeOfDay}
- Weather: {weather}

TASK: Describe how the environment changes in response to the trigger event:
1. Make the change feel natural and immersive
2. Include appropriate sensory details
3. Maintain atmosphere and tone
4. Suggest possible implications for the player

CONSTRAINTS:
- Keep under 150 words
- Write in second person
- Focus on environmental details
- Build tension or atmosphere as appropriate

Generate the environment change description now:`);
  }

  /**
   * Generate narrative content using LLM
   */
  async generateNarrative(prompt: LLMPrompt): Promise<LLMResponse> {
    try {
      // Check cache first
      const cacheKey = this.createCacheKey(prompt);
      if (this.responseCache.has(cacheKey)) {
        const cached = this.responseCache.get(cacheKey)!;
        console.log(`📋 Using cached LLM response for ${prompt.type}`);
        return cached;
      }

      // Check rate limits
      if (!this.checkRateLimit()) {
        return {
          success: false,
          content: '',
          error: 'Rate limit exceeded. Please wait before making another request.'
        };
      }

      // Prepare the prompt
      const formattedPrompt = this.formatPrompt(prompt);
      
      console.log(`🤖 Generating ${prompt.type} with LLM...`);
      console.log(`📝 Prompt preview: ${formattedPrompt.substring(0, 100)}...`);

      // Make the API call (currently returns mock data)
      const response = await this.callLLM(formattedPrompt, prompt);
      
      // Cache the response
      this.responseCache.set(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('LLM generation error:', error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Format prompt using template and context
   */
  private formatPrompt(prompt: LLMPrompt): string {
    const template = this.promptTemplates.get(prompt.type);
    if (!template) {
      return prompt.specificPrompt;
    }

    let formatted = template;
    const context = prompt.context;

    // Replace template variables
    formatted = formatted.replace(/{roomName}/g, context.currentRoom.name || 'Unknown Room');
    formatted = formatted.replace(/{theme}/g, context.narrative.theme || 'adventure');
    formatted = formatted.replace(/{tone}/g, context.narrative.tone || 'serious');
    formatted = formatted.replace(/{timeOfDay}/g, context.gameState.timeOfDay || 'day');
    formatted = formatted.replace(/{playerLevel}/g, context.player.level?.toString() || '1');
    formatted = formatted.replace(/{playerStats}/g, JSON.stringify(context.player.stats || {}));
    formatted = formatted.replace(/{playerInventory}/g, context.player.inventory.map(i => i.name || i.id).join(', ') || 'empty');
    formatted = formatted.replace(/{items}/g, context.currentRoom.items.map(i => i.name || i.id).join(', ') || 'none');
    formatted = formatted.replace(/{npcs}/g, context.currentRoom.npcs.map(n => n.name || n.id).join(', ') || 'none');
    formatted = formatted.replace(/{connections}/g, Object.keys(context.currentRoom.connections || {}).join(', ') || 'none');
    formatted = formatted.replace(/{recentEvents}/g, context.gameState.recentEvents.slice(-3).map(e => e.type || e).join(', ') || 'none');
    formatted = formatted.replace(/{mood}/g, context.gameState.mood || 'neutral');
    formatted = formatted.replace(/{weather}/g, context.gameState.weather || 'clear');

    // Add specific prompt content
    formatted += '\n\n' + prompt.specificPrompt;

    return formatted;
  }

  /**
   * Call the actual LLM (currently mock implementation)
   */
  private async callLLM(prompt: string, promptData: LLMPrompt): Promise<LLMResponse> {
    // TODO: Replace with actual LLM API call
    // For now, return mock responses based on prompt type
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const mockResponses = this.generateMockResponse(promptData);
    
    return {
      success: true,
      content: mockResponses.content,
      metadata: {
        tokens_used: Math.floor(Math.random() * 200) + 50,
        processing_time: Math.floor(Math.random() * 1000) + 200,
        confidence: 0.85,
        model_used: this.config.model
      },
      structuredData: mockResponses.structuredData
    };
  }

  /**
   * Generate mock responses for different prompt types (remove when LLM is integrated)
   */
  private generateMockResponse(prompt: LLMPrompt): { content: string; structuredData?: any } {
    switch (prompt.type) {
      case 'room_description':
        return {
          content: `You stand in the ${prompt.context.currentRoom.name.toLowerCase()}, where shadows dance across weathered stone walls. The air carries the musty scent of age and secrets. ${this.getMockRoomDetails(prompt.context.currentRoom)} Your footsteps echo in the oppressive silence, and you sense that this place holds more than meets the eye.`
        };

      case 'npc_dialogue':
        return {
          content: `"Greetings, traveler," the figure says, their voice carrying an otherworldly quality. "I have been expecting you."`,
          structuredData: {
            choices: [
              "Who are you?",
              "What do you want from me?",
              "I'm just passing through.",
              "Tell me about this place."
            ]
          }
        };

      case 'action_result':
        return {
          content: `Your action resonates through the space, causing subtle changes in your surroundings. The consequences of your choice become immediately apparent.`
        };

      case 'quest_logic':
        return {
          content: "Quest progression updated",
          structuredData: {
            nextObjective: "Investigate the mysterious artifact",
            successConditions: "Find and examine the glowing object",
            hint: "Look for sources of light in dark places",
            reward: "Ancient knowledge",
            consequences: "The darkness grows stronger if you fail"
          }
        };

      case 'environment_change':
        return {
          content: `The atmosphere shifts palpably around you. The air grows colder, and you notice that the shadows seem deeper than before. Something fundamental has changed in this place.`
        };

      default:
        return {
          content: "The LLM responds with dynamically generated content based on your current situation and context."
        };
    }
  }

  /**
   * Helper to create mock room details
   */
  private getMockRoomDetails(room: any): string {
    const details = [];
    if (room.items && room.items.length > 0) {
      details.push(`You notice ${room.items.map((i: any) => i.name || 'an object').join(', ')} here.`);
    }
    if (room.npcs && room.npcs.length > 0) {
      details.push(`${room.npcs.map((n: any) => n.name || 'A figure').join(' and ')} ${room.npcs.length === 1 ? 'stands' : 'stand'} nearby.`);
    }
    return details.join(' ');
  }

  /**
   * Create cache key for response caching
   */
  private createCacheKey(prompt: LLMPrompt): string {
    const contextHash = JSON.stringify({
      type: prompt.type,
      room: prompt.context.currentRoom.id,
      player: prompt.context.player.id,
      recent: prompt.context.gameState.recentEvents.slice(-2),
      prompt: prompt.specificPrompt.substring(0, 100)
    });
    return Buffer.from(contextHash).toString('base64').substring(0, 32);
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 30; // 30 requests per minute
    
    if (!this.rateLimitTracker.has('requests')) {
      this.rateLimitTracker.set('requests', []);
    }
    
    const requests = this.rateLimitTracker.get('requests')!;
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.rateLimitTracker.set('requests', validRequests);
    return true;
  }

  /**
   * Generate room description with LLM
   */
  async generateRoomDescription(context: GameContext, specificDetails?: string): Promise<string> {
    const prompt: LLMPrompt = {
      type: 'room_description',
      context,
      specificPrompt: specificDetails || 'Generate an atmospheric room description that immerses the player in the current location.',
      constraints: {
        maxLength: 200,
        style: 'atmospheric',
        includeOptions: false
      }
    };

    const response = await this.generateNarrative(prompt);
    return response.success ? response.content : context.currentRoom.description;
  }

  /**
   * Generate NPC dialogue with LLM
   */
  async generateNPCDialogue(context: GameContext, npcId: string, playerAction: string): Promise<{ dialogue: string; choices: string[] }> {
    const npc = context.currentRoom.npcs.find(n => n.id === npcId);
    if (!npc) {
      return { dialogue: "The figure remains silent.", choices: ["Continue on your way."] };
    }

    const prompt: LLMPrompt = {
      type: 'npc_dialogue',
      context: {
        ...context,
        player: {
          ...context.player,
          recentActions: [...(context.player.recentActions || []), playerAction]
        }
      },
      specificPrompt: `The player has chosen to: ${playerAction}. Generate appropriate dialogue for ${npc.name} (${npc.npcType}) and provide meaningful response options.`,
      constraints: {
        includeOptions: true,
        mustInclude: ['dialogue response', 'player choices']
      }
    };

    const response = await this.generateNarrative(prompt);
    return {
      dialogue: response.success ? response.content : `${npc.name} responds to your action.`,
      choices: response.structuredData?.choices || ["Continue the conversation.", "End the conversation."]
    };
  }

  /**
   * Generate action result with LLM
   */
  async generateActionResult(context: GameContext, action: string, outcome: 'success' | 'failure' | 'partial'): Promise<string> {
    const prompt: LLMPrompt = {
      type: 'action_result',
      context,
      specificPrompt: `The player attempted: ${action}. The outcome was: ${outcome}. Generate an immersive description of what happens.`,
      constraints: {
        maxLength: 100,
        style: 'responsive'
      }
    };

    const response = await this.generateNarrative(prompt);
    return response.success ? response.content : `Your attempt to ${action} has ${outcome === 'success' ? 'succeeded' : 'failed'}.`;
  }

  /**
   * Generate quest logic with LLM
   */
  async generateQuestLogic(context: GameContext, questId: string, currentStep: string): Promise<any> {
    const prompt: LLMPrompt = {
      type: 'quest_logic',
      context,
      specificPrompt: `Current quest: ${questId}, Step: ${currentStep}. Generate the next quest step and logic.`,
      constraints: {
        includeOptions: true,
        mustInclude: ['objective', 'conditions', 'rewards']
      }
    };

    const response = await this.generateNarrative(prompt);
    return response.structuredData || {
      nextObjective: "Continue your journey",
      successConditions: "Explore and discover",
      reward: "Experience and knowledge"
    };
  }

  /**
   * Clear response cache
   */
  clearCache(): void {
    this.responseCache.clear();
    console.log('🧹 LLM response cache cleared');
  }

  /**
   * Get system statistics
   */
  getStats(): {
    cacheSize: number;
    totalRequests: number;
    rateLimitRemaining: number;
    config: LLMConfig;
  } {
    const requests = this.rateLimitTracker.get('requests') || [];
    const now = Date.now();
    const recentRequests = requests.filter(time => now - time < 60000);

    return {
      cacheSize: this.responseCache.size,
      totalRequests: requests.length,
      rateLimitRemaining: Math.max(0, 30 - recentRequests.length),
      config: { ...this.config }
    };
  }

  /**
   * Update LLM configuration
   */
  updateConfig(newConfig: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 LLM configuration updated');
  }
}