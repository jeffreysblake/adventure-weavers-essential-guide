import { Injectable, Logger } from '@nestjs/common';
import { GameContext } from '../interfaces/llm.interface';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'generation' | 'conflict_resolution' | 'enhancement' | 'validation';
  template: string;
  variables: PromptVariable[];
  systemPrompt?: string;
  examples?: PromptExample[];
  constraints?: string[];
  outputFormat?: 'text' | 'json' | 'structured';
  version: string;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface PromptExample {
  input: Record<string, any>;
  expectedOutput: string;
  description: string;
}

export interface CompiledPrompt {
  prompt: string;
  systemPrompt?: string;
  variables: Record<string, any>;
  metadata: {
    templateId: string;
    compiledAt: string;
    variables: string[];
  };
}

@Injectable()
export class PromptTemplateService {
  private readonly logger = new Logger(PromptTemplateService.name);
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.loadDefaultTemplates();
  }

  /**
   * Register a new prompt template
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
    this.logger.log(`Registered prompt template: ${template.id} (${template.category})`);
  }

  /**
   * Get a template by ID
   */
  getTemplate(templateId: string): PromptTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * List templates by category
   */
  getTemplatesByCategory(category: string): PromptTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.category === category);
  }

  /**
   * Compile a template with provided variables
   */
  compileTemplate(templateId: string, variables: Record<string, any>): CompiledPrompt {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Validate variables
    this.validateVariables(template, variables);

    // Compile the prompt
    const prompt = this.replaceVariables(template.template, variables);
    const systemPrompt = template.systemPrompt ? 
      this.replaceVariables(template.systemPrompt, variables) : undefined;

    return {
      prompt,
      systemPrompt,
      variables,
      metadata: {
        templateId,
        compiledAt: new Date().toISOString(),
        variables: Object.keys(variables)
      }
    };
  }

  /**
   * Compile template with game context
   */
  compileWithContext(templateId: string, context: GameContext, additionalVariables: Record<string, any> = {}): CompiledPrompt {
    const contextVariables = this.extractContextVariables(context);
    const allVariables = { ...contextVariables, ...additionalVariables };
    
    return this.compileTemplate(templateId, allVariables);
  }

  /**
   * Render template directly to string (convenience method)
   */
  async renderTemplate(templateId: string, variables: Record<string, any>): Promise<string> {
    const compiled = this.compileTemplate(templateId, variables);
    return compiled.prompt;
  }

  /**
   * Load default templates
   */
  private loadDefaultTemplates(): void {
    // Room Description Template
    this.registerTemplate({
      id: 'room_description',
      name: 'Room Description Generator',
      description: 'Generate rich descriptions for rooms based on context',
      category: 'generation',
      version: '1.0.0',
      template: `Generate a vivid description for {{room_name}} in a {{game_theme}} setting.

Room Details:
- Name: {{room_name}}
- Type: {{room_type}}
- Size: {{room_size}}
- Theme: {{room_theme}}
- Objects present: {{objects_list}}
- Connected rooms: {{connected_rooms}}
- Time of day: {{time_of_day}}
- Lighting: {{lighting}}

The description should:
1. Create a vivid sensory experience (sight, sound, smell, feel)
2. Mention notable objects naturally within the description
3. Convey the room's purpose and atmosphere
4. Use {{narrative_style}} writing style
5. Be {{description_length}} in length

Write an immersive description that draws the reader into the space:`,
      variables: [
        { name: 'room_name', type: 'string', required: true, description: 'Name of the room' },
        { name: 'room_type', type: 'string', required: true, description: 'Type/purpose of the room' },
        { name: 'room_size', type: 'string', required: false, description: 'Size description', defaultValue: 'medium' },
        { name: 'room_theme', type: 'string', required: true, description: 'Room theme/style' },
        { name: 'game_theme', type: 'string', required: true, description: 'Overall game theme' },
        { name: 'objects_list', type: 'string', required: false, description: 'List of objects in room', defaultValue: 'various items' },
        { name: 'connected_rooms', type: 'string', required: false, description: 'Connected rooms', defaultValue: 'other areas' },
        { name: 'time_of_day', type: 'string', required: false, description: 'Current time', defaultValue: 'day' },
        { name: 'lighting', type: 'string', required: false, description: 'Lighting conditions', defaultValue: 'well-lit' },
        { name: 'narrative_style', type: 'string', required: false, description: 'Writing style', defaultValue: 'descriptive' },
        { name: 'description_length', type: 'string', required: false, description: 'Length preference', defaultValue: 'detailed' }
      ],
      systemPrompt: 'You are a master storyteller creating immersive game environments. Focus on creating atmospheric descriptions that enhance player engagement.',
      outputFormat: 'text'
    });

    // NPC Generation Template
    this.registerTemplate({
      id: 'npc_generation',
      name: 'NPC Character Generator',
      description: 'Create detailed NPCs with personalities and backgrounds',
      category: 'generation',
      version: '1.0.0',
      template: `Create a detailed NPC for {{location}} in a {{game_theme}} setting.

Context:
- Location: {{location}}
- Game Theme: {{game_theme}}
- NPC Role: {{npc_role}}
- Importance Level: {{importance_level}}
- Cultural Setting: {{cultural_setting}}
- Existing NPCs: {{existing_npcs}}

Generate a complete NPC with the following JSON structure:
{
  "name": "Character's full name",
  "role": "Their function/job",
  "age": "Age or age range",
  "appearance": "Physical description",
  "personality": {
    "traits": ["list", "of", "personality", "traits"],
    "values": ["what", "they", "value"],
    "fears": ["what", "they", "fear"],
    "motivations": ["what", "drives", "them"]
  },
  "background": "Brief personal history",
  "speech_pattern": {
    "formality": "casual/formal/archaic",
    "verbosity": "terse/normal/verbose",
    "accent": "description of accent/dialect",
    "common_phrases": ["phrases", "they", "use"]
  },
  "relationships": [
    {
      "target": "other character name",
      "relationship": "ally/enemy/neutral/family",
      "description": "nature of relationship"
    }
  ],
  "secrets": ["hidden", "information", "they", "know"],
  "skills": ["abilities", "and", "talents"],
  "possessions": ["important", "items", "they", "carry"],
  "daily_routine": "what they typically do",
  "current_mood": "their present emotional state",
  "goals": ["short", "term", "objectives"]
}`,
      variables: [
        { name: 'location', type: 'string', required: true, description: 'Where the NPC is located' },
        { name: 'game_theme', type: 'string', required: true, description: 'Game setting/theme' },
        { name: 'npc_role', type: 'string', required: true, description: 'NPC function/job' },
        { name: 'importance_level', type: 'string', required: false, description: 'Story importance', defaultValue: 'minor' },
        { name: 'cultural_setting', type: 'string', required: false, description: 'Cultural context', defaultValue: 'standard fantasy' },
        { name: 'existing_npcs', type: 'string', required: false, description: 'Other NPCs to relate to', defaultValue: 'none specified' }
      ],
      systemPrompt: 'You are a character creation expert. Create believable, three-dimensional NPCs with consistent personalities and clear motivations.',
      outputFormat: 'json'
    });

    // Conflict Resolution Template
    this.registerTemplate({
      id: 'physics_conflict_resolution',
      name: 'Physics Conflict Resolver',
      description: 'Resolve impossible physics scenarios with narrative explanations',
      category: 'conflict_resolution',
      version: '1.0.0',
      template: `A physics conflict has occurred in {{game_name}}:

Conflict Details:
- Type: {{conflict_type}}
- Affected Objects: {{affected_objects}}
- Location: {{location}}
- Description: {{conflict_description}}
- Game Rules: {{physics_rules}}

Current Situation:
{{current_situation}}

World Context:
- Theme: {{game_theme}}
- Magic System: {{magic_system}}
- Technology Level: {{tech_level}}

Provide a resolution that:
1. Maintains game world consistency
2. Provides a believable explanation
3. Offers alternative solutions if possible
4. Considers player immersion

Respond with JSON:
{
  "primary_solution": {
    "action": "specific action to take",
    "explanation": "narrative explanation for players",
    "side_effects": ["any", "consequences"],
    "reversible": true/false
  },
  "alternative_solutions": [
    {
      "action": "alternative action",
      "explanation": "alternative explanation",
      "pros": ["advantages"],
      "cons": ["disadvantages"]
    }
  ],
  "narrative_description": "Rich description of how the resolution appears in-game",
  "consistency_notes": "How this maintains world logic"
}`,
      variables: [
        { name: 'game_name', type: 'string', required: true, description: 'Name of the game' },
        { name: 'conflict_type', type: 'string', required: true, description: 'Type of physics conflict' },
        { name: 'affected_objects', type: 'string', required: true, description: 'Objects involved in conflict' },
        { name: 'location', type: 'string', required: true, description: 'Where conflict occurred' },
        { name: 'conflict_description', type: 'string', required: true, description: 'Detailed conflict description' },
        { name: 'physics_rules', type: 'string', required: true, description: 'Established physics rules' },
        { name: 'current_situation', type: 'string', required: true, description: 'Current game state' },
        { name: 'game_theme', type: 'string', required: true, description: 'Game world theme' },
        { name: 'magic_system', type: 'string', required: false, description: 'Magic system rules', defaultValue: 'none' },
        { name: 'tech_level', type: 'string', required: false, description: 'Technology level', defaultValue: 'medieval' }
      ],
      systemPrompt: 'You are a game master expert at maintaining world consistency while resolving impossible situations. Prioritize player immersion and believable explanations.',
      outputFormat: 'json'
    });

    // Dialogue Generation Template
    this.registerTemplate({
      id: 'npc_dialogue',
      name: 'NPC Dialogue Generator',
      description: 'Generate contextual dialogue for NPCs',
      category: 'generation',
      version: '1.0.0',
      template: `Generate dialogue for {{npc_name}} in the current situation.

NPC Details:
- Name: {{npc_name}}
- Role: {{npc_role}}
- Personality: {{personality_traits}}
- Current Mood: {{current_mood}}
- Speech Pattern: {{speech_pattern}}
- Relationship to Player: {{player_relationship}}

Situation:
- Context: {{dialogue_context}}
- Player Action: {{player_action}}
- Location: {{location}}
- Recent Events: {{recent_events}}
- NPC's Goals: {{npc_goals}}

Conversation History:
{{conversation_history}}

Generate appropriate dialogue that:
1. Reflects the NPC's personality and speech patterns
2. Responds appropriately to the situation
3. Advances the interaction meaningfully
4. Maintains character consistency
5. Fits the {{dialogue_tone}} tone

Response format:
{
  "dialogue": "The actual words the NPC speaks",
  "internal_thoughts": "What the NPC is thinking (not spoken)",
  "body_language": "Non-verbal communication/actions",
  "mood_change": "any change in emotional state",
  "hidden_agenda": "any secret motivations affecting the response",
  "relationship_impact": "how this might affect the relationship",
  "follow_up_options": ["possible", "conversation", "directions"]
}`,
      variables: [
        { name: 'npc_name', type: 'string', required: true, description: 'NPC name' },
        { name: 'npc_role', type: 'string', required: true, description: 'NPC role/job' },
        { name: 'personality_traits', type: 'string', required: true, description: 'Key personality traits' },
        { name: 'current_mood', type: 'string', required: true, description: 'Current emotional state' },
        { name: 'speech_pattern', type: 'string', required: true, description: 'How they speak' },
        { name: 'player_relationship', type: 'string', required: true, description: 'Relationship to player' },
        { name: 'dialogue_context', type: 'string', required: true, description: 'Current situation context' },
        { name: 'player_action', type: 'string', required: false, description: 'What player just did', defaultValue: 'approached' },
        { name: 'location', type: 'string', required: true, description: 'Current location' },
        { name: 'recent_events', type: 'string', required: false, description: 'Recent significant events', defaultValue: 'nothing notable' },
        { name: 'npc_goals', type: 'string', required: false, description: 'NPC current objectives', defaultValue: 'daily routine' },
        { name: 'conversation_history', type: 'string', required: false, description: 'Previous conversation', defaultValue: 'first meeting' },
        { name: 'dialogue_tone', type: 'string', required: false, description: 'Desired tone', defaultValue: 'natural' }
      ],
      systemPrompt: 'You are an expert at creating believable NPC dialogue. Make each character feel unique and authentic while advancing the story.',
      outputFormat: 'json'
    });

    // Object Generation Template
    this.registerTemplate({
      id: 'object_generation',
      name: 'Dynamic Object Generator',
      description: 'Create objects that fit the game world and current context',
      category: 'generation',
      version: '1.0.0',
      template: `Create a new object for {{location}} in {{game_theme}} setting.

Context:
- Location: {{location}}
- Game Theme: {{game_theme}}
- Object Purpose: {{object_purpose}}
- Material Constraints: {{available_materials}}
- Cultural Setting: {{cultural_setting}}
- Technology Level: {{tech_level}}
- Existing Objects: {{existing_objects}}
- Player Level: {{player_level}}

Requirements:
- Must fit the location's purpose and theme
- Should be interesting but not overpowered
- Must respect world consistency
- Should enhance gameplay or narrative

Generate object with JSON structure:
{
  "name": "Object name",
  "description": "Detailed description for examination",
  "brief_description": "Short description for room listings",
  "type": "object category (weapon/tool/decoration/etc)",
  "material": "primary material",
  "weight": "weight in appropriate units",
  "size": {
    "width": "width",
    "height": "height",
    "depth": "depth"
  },
  "properties": {
    "is_portable": true/false,
    "is_container": true/false,
    "can_contain": true/false,
    "container_capacity": "if container",
    "durability": "condition/health",
    "value": "estimated worth",
    "magical": true/false,
    "interactive": true/false
  },
  "functionality": {
    "primary_use": "main purpose",
    "secondary_uses": ["other", "possible", "uses"],
    "special_abilities": ["any", "special", "features"],
    "requirements": ["requirements", "to", "use"]
  },
  "backstory": "History or origin of the object",
  "cultural_significance": "Cultural importance if any",
  "craftsmanship": "Quality and style of creation",
  "markings": "Any inscriptions, symbols, or identifying marks",
  "condition": "Current state/wear",
  "location_placement": "Suggested placement within the location"
}`,
      variables: [
        { name: 'location', type: 'string', required: true, description: 'Where object will be placed' },
        { name: 'game_theme', type: 'string', required: true, description: 'Overall game theme' },
        { name: 'object_purpose', type: 'string', required: true, description: 'Why object is needed' },
        { name: 'available_materials', type: 'string', required: false, description: 'Available materials', defaultValue: 'common materials' },
        { name: 'cultural_setting', type: 'string', required: false, description: 'Cultural context', defaultValue: 'standard fantasy' },
        { name: 'tech_level', type: 'string', required: false, description: 'Technology level', defaultValue: 'medieval' },
        { name: 'existing_objects', type: 'string', required: false, description: 'Objects already present', defaultValue: 'none specified' },
        { name: 'player_level', type: 'string', required: false, description: 'Player progression level', defaultValue: 'beginner' }
      ],
      systemPrompt: 'You are a creative game designer who creates objects that enhance both gameplay and storytelling. Every object should feel like it belongs in the world.',
      outputFormat: 'json'
    });

    // Room Enhancement Template
    this.registerTemplate({
      id: 'room_enhancement',
      name: 'Room Enhancement Generator',
      description: 'Enhance existing rooms with new elements',
      category: 'enhancement',
      version: '1.0.0',
      template: `Enhance the existing room with the requested improvements.

Current Room:
{{existingRoom}}

Enhancement Requests:
{{enhancements}}

Current Objects:
{{currentObjects}}

Create enhancements that:
1. Complement the existing room design
2. Add meaningful gameplay elements
3. Maintain thematic consistency
4. Enhance the room's atmosphere

Generate the enhancements using the room content JSON schema, focusing only on the new additions.`,
      variables: [
        { name: 'existingRoom', type: 'string', required: true, description: 'Current room data' },
        { name: 'enhancements', type: 'string', required: true, description: 'Requested enhancements' },
        { name: 'currentObjects', type: 'string', required: false, description: 'Current objects', defaultValue: 'none' }
      ],
      systemPrompt: 'You are enhancing existing game content. Maintain consistency while adding meaningful improvements.',
      outputFormat: 'json'
    });

    // NPC Enhancement Template
    this.registerTemplate({
      id: 'npc_enhancement',
      name: 'NPC Enhancement Generator',
      description: 'Enhance existing NPCs with new attributes',
      category: 'enhancement',
      version: '1.0.0',
      template: `Enhance the existing NPC with the requested improvements.

Current NPC:
{{existingNPC}}

Enhancement Requests:
{{enhancements}}

Create enhancements that:
1. Build upon the NPC's existing personality
2. Add depth without contradicting established traits
3. Create new interaction possibilities
4. Maintain character consistency

Generate the enhanced NPC using the full NPC JSON schema.`,
      variables: [
        { name: 'existingNPC', type: 'string', required: true, description: 'Current NPC data' },
        { name: 'enhancements', type: 'string', required: true, description: 'Requested enhancements' }
      ],
      systemPrompt: 'You are enhancing existing NPCs. Build upon their established character while adding meaningful depth.',
      outputFormat: 'json'
    });

    // Story Generation Template
    this.registerTemplate({
      id: 'story_generation',
      name: 'Comprehensive Story Generator',
      description: 'Generate complete story structures with acts, characters, and quests',
      category: 'generation',
      version: '1.0.0',
      template: `Create a comprehensive {{genre}} story with the theme "{{theme}}".

Story Parameters:
- Genre: {{genre}}
- Theme: {{theme}}
- Target Length: {{targetLength}}
- Player Level: {{playerLevel}}
- Key Elements: {{keyElements}}
- Conflicts: {{conflicts}}
- Desired Outcome: {{desiredOutcome}}

Constraints:
- Maximum {{maxRooms}} locations
- Maximum {{maxNPCs}} characters
- Story should be appropriate for player level {{playerLevel}}

Create a complete story structure with:
1. Compelling title and synopsis
2. 3-5 story acts with clear progression
3. Memorable characters with distinct roles
4. Diverse locations that serve the narrative
5. Engaging plot hooks and quest lines
6. Appropriate difficulty scaling

Generate using the story JSON schema.`,
      variables: [
        { name: 'genre', type: 'string', required: true, description: 'Story genre' },
        { name: 'theme', type: 'string', required: true, description: 'Story theme' },
        { name: 'targetLength', type: 'string', required: true, description: 'Story length' },
        { name: 'playerLevel', type: 'string', required: true, description: 'Player level' },
        { name: 'keyElements', type: 'string', required: false, description: 'Key story elements', defaultValue: 'adventure' },
        { name: 'conflicts', type: 'string', required: false, description: 'Story conflicts', defaultValue: 'challenges' },
        { name: 'desiredOutcome', type: 'string', required: false, description: 'Story outcome', defaultValue: 'open' },
        { name: 'maxRooms', type: 'string', required: true, description: 'Maximum locations' },
        { name: 'maxNPCs', type: 'string', required: true, description: 'Maximum characters' }
      ],
      systemPrompt: 'You are a master storyteller creating engaging narrative adventures. Focus on compelling characters, interesting conflicts, and meaningful choices.',
      outputFormat: 'json'
    });

    // Quest Generation Template
    this.registerTemplate({
      id: 'quest_generation',
      name: 'Dynamic Quest Generator',
      description: 'Generate quests with objectives, rewards, and dialogue',
      category: 'generation',
      version: '1.0.0',
      template: `Create a {{type}} quest with difficulty level {{difficulty}}.

Quest Parameters:
- Type: {{type}}
- Difficulty: {{difficulty}}/10
- Objectives: {{objectives}}
- NPCs Involved: {{npcsInvolved}}
- Locations: {{locationsInvolved}}
- Prerequisites: {{prerequisites}}

Create a quest that:
1. Matches the specified difficulty level
2. Has clear, achievable objectives
3. Offers appropriate rewards
4. Includes engaging dialogue
5. Fits the game world

Generate using the quest JSON schema with complete objectives, rewards, and dialogue.`,
      variables: [
        { name: 'type', type: 'string', required: true, description: 'Quest type' },
        { name: 'difficulty', type: 'string', required: true, description: 'Difficulty level' },
        { name: 'objectives', type: 'string', required: true, description: 'Quest objectives' },
        { name: 'npcsInvolved', type: 'string', required: false, description: 'NPCs involved', defaultValue: 'none' },
        { name: 'locationsInvolved', type: 'string', required: false, description: 'Locations involved', defaultValue: 'current area' },
        { name: 'prerequisites', type: 'string', required: false, description: 'Prerequisites', defaultValue: 'none' }
      ],
      systemPrompt: 'You are designing engaging quests. Create clear objectives, fair rewards, and interesting challenges that enhance gameplay.',
      outputFormat: 'json'
    });

    // Plot Twist Template
    this.registerTemplate({
      id: 'plot_twist',
      name: 'Dynamic Plot Twist Generator',
      description: 'Generate plot twists based on current story state',
      category: 'generation',
      version: '1.0.0',
      template: `Generate a compelling plot twist for the current story situation.

Current Story State:
{{currentState}}

Story Progress: {{storyProgress}}

Create a plot twist that:
1. Surprises but makes sense in hindsight
2. Recontextualizes previous events
3. Opens new narrative possibilities
4. Maintains story coherence
5. Creates dramatic tension

The twist should be impactful but not story-breaking.`,
      variables: [
        { name: 'currentState', type: 'string', required: true, description: 'Current story situation' },
        { name: 'storyProgress', type: 'string', required: false, description: 'Story completion percentage', defaultValue: '50%' }
      ],
      systemPrompt: 'You are a master of dramatic storytelling. Create plot twists that surprise and delight while maintaining narrative integrity.',
      outputFormat: 'json'
    });

    // Adaptive Narrative Template
    this.registerTemplate({
      id: 'adaptive_narrative',
      name: 'Adaptive Narrative Generator',
      description: 'Generate narrative responses to player actions',
      category: 'generation',
      version: '1.0.0',
      template: `Generate a narrative response to the player's actions and adapt the story accordingly.

Player Actions:
{{playerActions}}

Current Game State:
{{gameState}}

Story Context:
{{storyContext}}

Create a response that:
1. Acknowledges the player's choices
2. Shows meaningful consequences
3. Advances the narrative
4. Introduces new elements as needed
5. Maintains story momentum

The response should feel reactive and personalized to the player's actions.`,
      variables: [
        { name: 'playerActions', type: 'string', required: true, description: 'Recent player actions' },
        { name: 'gameState', type: 'string', required: true, description: 'Current game state' },
        { name: 'storyContext', type: 'string', required: true, description: 'Story context' }
      ],
      systemPrompt: 'You are adapting the story in real-time based on player choices. Create responsive, engaging narrative that feels personal.',
      outputFormat: 'json'
    });

    // Story Validation Template
    this.registerTemplate({
      id: 'story_validation',
      name: 'Story Content Validator',
      description: 'Validate generated story content for quality and consistency',
      category: 'validation',
      version: '1.0.0',
      template: `Validate the generated story content for quality, consistency, and gameplay value.

Story Details:
{{story}}

Content Statistics:
- Rooms: {{rooms}}
- NPCs: {{npcs}}
- Quests: {{quests}}
- Theme: {{theme}}
- Genre: {{genre}}
- Player Level: {{playerLevel}}

Evaluate the story for:
1. Internal consistency and logical flow
2. Appropriate balance for player level
3. Engaging content that matches theme/genre
4. Technical issues or contradictions
5. Overall narrative quality

Provide validation results with specific issues and quality assessment.`,
      variables: [
        { name: 'story', type: 'string', required: true, description: 'Story content to validate' },
        { name: 'rooms', type: 'string', required: true, description: 'Number of rooms' },
        { name: 'npcs', type: 'string', required: true, description: 'Number of NPCs' },
        { name: 'quests', type: 'string', required: true, description: 'Number of quests' },
        { name: 'theme', type: 'string', required: true, description: 'Story theme' },
        { name: 'genre', type: 'string', required: true, description: 'Story genre' },
        { name: 'playerLevel', type: 'string', required: true, description: 'Target player level' }
      ],
      systemPrompt: 'You are a quality assurance expert for game content. Provide thorough, actionable validation feedback.',
      outputFormat: 'json'
    });

    // Story Summary Template
    this.registerTemplate({
      id: 'story_summary',
      name: 'Story Summary Generator',
      description: 'Generate summary of completed story creation',
      category: 'generation',
      version: '1.0.0',
      template: `Generate a compelling summary of the completed story creation.

Story Details:
- Theme: {{theme}}
- Genre: {{genre}}
- Rooms Created: {{roomCount}}
- NPCs Created: {{npcCount}}
- Quests Created: {{questCount}}

Create a summary that:
1. Highlights the key story elements
2. Describes the world that was created
3. Mentions notable characters and locations
4. Explains the types of adventures players can expect
5. Conveys the overall tone and atmosphere

Write an engaging summary that would excite players to explore this story.`,
      variables: [
        { name: 'theme', type: 'string', required: true, description: 'Story theme' },
        { name: 'genre', type: 'string', required: true, description: 'Story genre' },
        { name: 'roomCount', type: 'string', required: true, description: 'Number of rooms created' },
        { name: 'npcCount', type: 'string', required: true, description: 'Number of NPCs created' },
        { name: 'questCount', type: 'string', required: true, description: 'Number of quests created' }
      ],
      systemPrompt: 'You are a marketing copywriter who creates compelling game content descriptions that excite and engage players.',
      outputFormat: 'text'
    });

    this.logger.log(`Loaded ${this.templates.size} default prompt templates`);
  }

  /**
   * Extract variables from game context
   */
  private extractContextVariables(context: GameContext): Record<string, any> {
    const variables: Record<string, any> = {};

    // Game info
    variables.game_name = context.gameInfo.name;
    variables.game_theme = context.gameInfo.theme;
    variables.game_genre = context.gameInfo.genre;

    // Current scene
    if (context.currentScene.activeRoom) {
      variables.location = context.currentScene.activeRoom.room.name;
      variables.room_name = context.currentScene.activeRoom.room.name;
      variables.room_type = context.currentScene.activeRoom.room.type || 'unknown';
      variables.room_theme = context.currentScene.activeRoom.room.description || '';
      
      // Objects in room
      const objectNames = context.currentScene.activeRoom.objects.map(obj => obj.object.name);
      variables.objects_list = objectNames.length > 0 ? objectNames.join(', ') : 'none';
      variables.existing_objects = objectNames.join(', ');

      // Room connections
      const connections = context.currentScene.activeRoom.connections.map(conn => 
        `${conn.direction} to ${conn.targetRoomId}`
      );
      variables.connected_rooms = connections.join(', ');

      // Ambiance
      variables.lighting = context.currentScene.activeRoom.ambiance.lighting;
      variables.time_of_day = context.currentScene.timeOfDay || 'unknown';
    }

    // World constraints
    if (context.constraints) {
      variables.cultural_setting = context.constraints.culturalSettings?.era || 'fantasy';
      variables.tech_level = context.constraints.culturalSettings?.technology || 'medieval';
      variables.narrative_style = context.constraints.narrativeGuidelines?.tone || 'balanced';
      
      // Physics rules
      const physicsRules = context.constraints.physicsRules?.map(rule => rule.description) || [];
      variables.physics_rules = physicsRules.join(', ');
    }

    // Player context
    if (context.playerContext) {
      variables.player_level = context.playerContext.player.level?.toString() || '1';
      variables.player_relationship = 'neutral'; // Default
    }

    return variables;
  }

  /**
   * Validate template variables
   */
  private validateVariables(template: PromptTemplate, variables: Record<string, any>): void {
    for (const variable of template.variables) {
      const value = variables[variable.name];

      // Check required variables
      if (variable.required && (value === undefined || value === null)) {
        throw new Error(`Required variable missing: ${variable.name}`);
      }

      // Use default value if not provided
      if (value === undefined && variable.defaultValue !== undefined) {
        variables[variable.name] = variable.defaultValue;
        continue;
      }

      if (value !== undefined) {
        // Type validation
        if (!this.validateVariableType(value, variable.type)) {
          throw new Error(`Variable ${variable.name} has invalid type. Expected ${variable.type}, got ${typeof value}`);
        }

        // Additional validation
        if (variable.validation) {
          this.validateVariableConstraints(variable.name, value, variable.validation);
        }
      }
    }
  }

  /**
   * Validate variable type
   */
  private validateVariableType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * Validate variable constraints
   */
  private validateVariableConstraints(name: string, value: any, validation: any): void {
    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        throw new Error(`Variable ${name} is too short. Minimum length: ${validation.minLength}`);
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        throw new Error(`Variable ${name} is too long. Maximum length: ${validation.maxLength}`);
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        throw new Error(`Variable ${name} does not match required pattern`);
      }
    }

    if (typeof value === 'number') {
      if (validation.min && value < validation.min) {
        throw new Error(`Variable ${name} is too small. Minimum: ${validation.min}`);
      }
      if (validation.max && value > validation.max) {
        throw new Error(`Variable ${name} is too large. Maximum: ${validation.max}`);
      }
    }
  }

  /**
   * Replace variables in template string
   */
  private replaceVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      if (value === undefined) {
        this.logger.warn(`Template variable not found: ${variableName}`);
        return match; // Keep the placeholder if variable not found
      }
      return String(value);
    });
  }

  /**
   * Get template statistics
   */
  getStats(): {
    totalTemplates: number;
    categoryCounts: Record<string, number>;
    templateIds: string[];
  } {
    const categoryCounts: Record<string, number> = {};
    
    for (const template of this.templates.values()) {
      categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
    }

    return {
      totalTemplates: this.templates.size,
      categoryCounts,
      templateIds: Array.from(this.templates.keys())
    };
  }
}