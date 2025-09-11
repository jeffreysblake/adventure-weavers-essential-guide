/**
 * Vertical Navigation System for Quest Weaver
 * Handles stairs, ropes, vines, ladders, and other vertical movement
 */

import { RoomSystem } from './room-system';
import { ItemSystem } from './item-system';
import { GameStateManager } from './game-state-manager';

export type VerticalConnectionType = 
  | 'stairs_up' 
  | 'stairs_down' 
  | 'rope_up' 
  | 'rope_down' 
  | 'ladder' 
  | 'vine' 
  | 'slide' 
  | 'elevator' 
  | 'magic_portal' 
  | 'teleporter';

export interface VerticalConnection {
  id: string;
  fromRoomId: string;
  toRoomId: string;
  connectionType: VerticalConnectionType;
  name: string;
  description: string;
  requirements?: {
    items?: string[]; // Items needed to use (e.g., rope, grappling hook)
    skills?: { [skill: string]: number }; // Minimum skill levels
    health?: number; // Minimum health required
  };
  difficulty?: number; // 0-1, chance of success
  consequences?: {
    failureMessage?: string;
    damageonFailure?: number;
    fallbackRoomId?: string; // Where player ends up if they fail
  };
  movementTime?: number; // Time taken to traverse (in seconds)
  soundEffect?: string;
  isReversible?: boolean; // Can you go back the same way?
}

export interface MovementResult {
  success: boolean;
  message: string;
  newRoomId?: string;
  damage?: number;
  timeElapsed?: number;
  soundEffect?: string;
  additionalEffects?: { [key: string]: any };
}

export class VerticalNavigationSystem {
  private connections: Map<string, VerticalConnection> = new Map();
  private roomConnections: Map<string, string[]> = new Map(); // roomId -> connectionIds

  constructor(
    private roomSystem: RoomSystem,
    private itemSystem: ItemSystem,
    private gameStateManager: GameStateManager
  ) {}

  /**
   * Create a new vertical connection between rooms
   */
  createConnection(
    fromRoomId: string,
    toRoomId: string,
    connectionType: VerticalConnectionType,
    name: string,
    description: string,
    options?: {
      requirements?: VerticalConnection['requirements'];
      difficulty?: number;
      consequences?: VerticalConnection['consequences'];
      movementTime?: number;
      soundEffect?: string;
      isReversible?: boolean;
    }
  ): string {
    const connectionId = `vertical_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const connection: VerticalConnection = {
      id: connectionId,
      fromRoomId,
      toRoomId,
      connectionType,
      name,
      description,
      requirements: options?.requirements,
      difficulty: options?.difficulty ?? 1.0, // Default to 100% success
      consequences: options?.consequences,
      movementTime: options?.movementTime ?? 5, // Default 5 seconds
      soundEffect: options?.soundEffect,
      isReversible: options?.isReversible ?? true
    };

    this.connections.set(connectionId, connection);
    
    // Track which connections are available from each room
    if (!this.roomConnections.has(fromRoomId)) {
      this.roomConnections.set(fromRoomId, []);
    }
    this.roomConnections.get(fromRoomId)!.push(connectionId);

    // If reversible, create the reverse connection tracking
    if (connection.isReversible) {
      if (!this.roomConnections.has(toRoomId)) {
        this.roomConnections.set(toRoomId, []);
      }
      this.roomConnections.get(toRoomId)!.push(connectionId);
    }

    console.log(`Created vertical connection: ${name} from ${fromRoomId} to ${toRoomId}`);
    return connectionId;
  }

  /**
   * Get all available vertical connections from a room
   */
  getAvailableConnections(roomId: string): VerticalConnection[] {
    const connectionIds = this.roomConnections.get(roomId) || [];
    return connectionIds
      .map(id => this.connections.get(id))
      .filter((conn): conn is VerticalConnection => conn !== undefined)
      .filter(conn => conn.fromRoomId === roomId || (conn.isReversible && conn.toRoomId === roomId));
  }

  /**
   * Attempt to use a vertical connection
   */
  attemptMovement(
    playerId: string,
    connectionId: string,
    playerInventory: any[] = [],
    playerStats: any = {},
    playerHealth: number = 100
  ): MovementResult {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return {
        success: false,
        message: "That path doesn't exist."
      };
    }

    // Check if player is in the right room
    const playerState = this.gameStateManager.getPlayerState(playerId);
    if (!playerState) {
      return {
        success: false,
        message: "Player not found."
      };
    }

    const currentRoomId = playerState.currentRoomId;
    const isReverse = currentRoomId === connection.toRoomId && connection.isReversible;
    const targetRoomId = isReverse ? connection.fromRoomId : connection.toRoomId;

    if (currentRoomId !== connection.fromRoomId && !isReverse) {
      return {
        success: false,
        message: "You can't use that from here."
      };
    }

    // Check requirements
    const requirementCheck = this.checkRequirements(connection, playerInventory, playerStats, playerHealth);
    if (!requirementCheck.success) {
      return requirementCheck;
    }

    // Attempt the movement based on difficulty
    const success = Math.random() <= connection.difficulty!;
    
    if (success) {
      // Successful movement
      this.gameStateManager.movePlayerToRoom(playerId, targetRoomId);
      
      // Record the event
      this.gameStateManager.recordEvent('vertical_movement', targetRoomId, playerId, {
        connectionType: connection.connectionType,
        connectionName: connection.name,
        fromRoom: currentRoomId,
        toRoom: targetRoomId,
        isReverse
      });

      return {
        success: true,
        message: this.getSuccessMessage(connection, isReverse),
        newRoomId: targetRoomId,
        timeElapsed: connection.movementTime,
        soundEffect: connection.soundEffect,
        additionalEffects: { 
          verticalMovement: true,
          connectionType: connection.connectionType 
        }
      };
    } else {
      // Failed movement
      const consequences = connection.consequences || {};
      let damage = consequences.damageonFailure || 0;
      let fallbackRoom = consequences.fallbackRoomId || currentRoomId;

      // Apply damage if any
      if (damage > 0) {
        // Would need to update player health in game state
        console.log(`Player takes ${damage} damage from failed vertical movement`);
      }

      // Move to fallback room if specified
      if (fallbackRoom !== currentRoomId) {
        this.gameStateManager.movePlayerToRoom(playerId, fallbackRoom);
      }

      return {
        success: false,
        message: consequences.failureMessage || this.getFailureMessage(connection),
        damage,
        newRoomId: fallbackRoom !== currentRoomId ? fallbackRoom : undefined
      };
    }
  }

  /**
   * Check if player meets requirements for using a connection
   */
  private checkRequirements(
    connection: VerticalConnection,
    playerInventory: any[],
    playerStats: any,
    playerHealth: number
  ): MovementResult {
    const requirements = connection.requirements;
    if (!requirements) {
      return { success: true, message: "Requirements met" };
    }

    // Check health requirement
    if (requirements.health && playerHealth < requirements.health) {
      return {
        success: false,
        message: `You're too injured to use ${connection.name}. You need at least ${requirements.health} health.`
      };
    }

    // Check item requirements
    if (requirements.items) {
      for (const requiredItem of requirements.items) {
        const hasItem = playerInventory.some(item => 
          item.name === requiredItem || item.id === requiredItem
        );
        if (!hasItem) {
          return {
            success: false,
            message: `You need a ${requiredItem} to use ${connection.name}.`
          };
        }
      }
    }

    // Check skill requirements
    if (requirements.skills) {
      for (const [skill, minLevel] of Object.entries(requirements.skills)) {
        const playerSkillLevel = playerStats[skill] || 0;
        if (playerSkillLevel < minLevel) {
          return {
            success: false,
            message: `You need ${skill} level ${minLevel} to use ${connection.name} (you have ${playerSkillLevel}).`
          };
        }
      }
    }

    return { success: true, message: "Requirements met" };
  }

  /**
   * Get success message for movement
   */
  private getSuccessMessage(connection: VerticalConnection, isReverse: boolean): string {
    const direction = isReverse ? "down" : "up";
    const oppositeDirection = isReverse ? "up" : "down";

    switch (connection.connectionType) {
      case 'stairs_up':
      case 'stairs_down':
        return isReverse 
          ? `You descend the ${connection.name}.`
          : `You climb up the ${connection.name}.`;
      
      case 'rope_up':
      case 'rope_down':
        return isReverse
          ? `You carefully climb down the ${connection.name}.`
          : `You grab the ${connection.name} and climb up.`;
      
      case 'ladder':
        return `You climb ${direction} the ${connection.name}.`;
      
      case 'vine':
        return isReverse
          ? `You swing down on the ${connection.name}.`
          : `You grab the ${connection.name} and swing upward.`;
      
      case 'slide':
        return `You slide down the ${connection.name}!`;
      
      case 'elevator':
        return `The ${connection.name} carries you ${direction}.`;
      
      case 'magic_portal':
        return `You step through the ${connection.name} and are magically transported.`;
      
      case 'teleporter':
        return `The ${connection.name} activates with a bright flash, teleporting you instantly.`;
      
      default:
        return `You use the ${connection.name} to move ${direction}.`;
    }
  }

  /**
   * Get failure message for movement
   */
  private getFailureMessage(connection: VerticalConnection): string {
    switch (connection.connectionType) {
      case 'stairs_up':
      case 'stairs_down':
        return `You stumble on the ${connection.name} and fall back.`;
      
      case 'rope_up':
      case 'rope_down':
        return `You lose your grip on the ${connection.name} and slide back down.`;
      
      case 'ladder':
        return `Your foot slips on the ${connection.name} and you fall.`;
      
      case 'vine':
        return `The ${connection.name} breaks under your weight!`;
      
      case 'slide':
        return `You get stuck partway down the ${connection.name}.`;
      
      case 'elevator':
        return `The ${connection.name} is broken and won't move.`;
      
      case 'magic_portal':
        return `The ${connection.name} flickers and rejects your passage.`;
      
      case 'teleporter':
        return `The ${connection.name} malfunctions with a loud buzz.`;
      
      default:
        return `You fail to use the ${connection.name}.`;
    }
  }

  /**
   * Get connection by ID
   */
  getConnection(connectionId: string): VerticalConnection | undefined {
    return this.connections.get(connectionId);
  }

  /**
   * Remove a connection
   */
  removeConnection(connectionId: string): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection) return false;

    // Remove from room tracking
    const fromConnections = this.roomConnections.get(connection.fromRoomId);
    if (fromConnections) {
      const index = fromConnections.indexOf(connectionId);
      if (index > -1) fromConnections.splice(index, 1);
    }

    if (connection.isReversible) {
      const toConnections = this.roomConnections.get(connection.toRoomId);
      if (toConnections) {
        const index = toConnections.indexOf(connectionId);
        if (index > -1) toConnections.splice(index, 1);
      }
    }

    return this.connections.delete(connectionId);
  }

  /**
   * Get a description of all available vertical movements from a room
   */
  getMovementOptions(roomId: string): string[] {
    const connections = this.getAvailableConnections(roomId);
    return connections.map(conn => {
      const isReverse = roomId === conn.toRoomId;
      const direction = this.getDirectionDescription(conn.connectionType, isReverse);
      return `${direction} via ${conn.name}: ${conn.description}`;
    });
  }

  /**
   * Get direction description for connection type
   */
  private getDirectionDescription(connectionType: VerticalConnectionType, isReverse: boolean): string {
    switch (connectionType) {
      case 'stairs_up':
        return isReverse ? 'Go down' : 'Go up';
      case 'stairs_down':
        return isReverse ? 'Go up' : 'Go down';
      case 'rope_up':
        return isReverse ? 'Climb down' : 'Climb up';
      case 'rope_down':
        return isReverse ? 'Climb up' : 'Climb down';
      case 'ladder':
        return isReverse ? 'Climb down' : 'Climb up';
      case 'vine':
        return isReverse ? 'Swing down' : 'Swing up';
      case 'slide':
        return 'Slide down';
      case 'elevator':
        return isReverse ? 'Take elevator down' : 'Take elevator up';
      case 'magic_portal':
        return 'Step through portal';
      case 'teleporter':
        return 'Use teleporter';
      default:
        return isReverse ? 'Go down' : 'Go up';
    }
  }

  /**
   * Create common vertical connections with sensible defaults
   */
  createStaircase(fromRoomId: string, toRoomId: string, name: string = "staircase"): string {
    return this.createConnection(
      fromRoomId,
      toRoomId,
      'stairs_up',
      name,
      `A sturdy ${name} leading upward.`,
      {
        difficulty: 0.95, // 95% success rate
        movementTime: 10,
        soundEffect: 'footsteps_on_stairs'
      }
    );
  }

  createRope(fromRoomId: string, toRoomId: string, name: string = "rope"): string {
    return this.createConnection(
      fromRoomId,
      toRoomId,
      'rope_up',
      name,
      `A thick ${name} hanging down from above.`,
      {
        difficulty: 0.8, // 80% success rate
        movementTime: 15,
        requirements: {
          skills: { strength: 5 },
          health: 50
        },
        consequences: {
          failureMessage: `You lose your grip on the ${name} and fall!`,
          damageonFailure: 10
        },
        soundEffect: 'rope_climbing'
      }
    );
  }

  createVineSwing(fromRoomId: string, toRoomId: string, name: string = "vine"): string {
    return this.createConnection(
      fromRoomId,
      toRoomId,
      'vine',
      name,
      `A strong ${name} perfect for swinging.`,
      {
        difficulty: 0.7, // 70% success rate
        movementTime: 8,
        requirements: {
          skills: { dexterity: 8 }
        },
        consequences: {
          failureMessage: `The ${name} snaps and you tumble to the ground!`,
          damageonFailure: 15
        },
        soundEffect: 'vine_swing',
        isReversible: false // Can't swing back up usually
      }
    );
  }

  createMagicPortal(fromRoomId: string, toRoomId: string, name: string = "magical portal"): string {
    return this.createConnection(
      fromRoomId,
      toRoomId,
      'magic_portal',
      name,
      `A shimmering ${name} crackling with arcane energy.`,
      {
        difficulty: 0.9, // 90% success rate
        movementTime: 2, // Instant
        requirements: {
          skills: { intelligence: 10 }
        },
        consequences: {
          failureMessage: `The ${name} rejects you with a blast of magical energy!`,
          damageonFailure: 5
        },
        soundEffect: 'magic_teleport'
      }
    );
  }
}