/**
 * Command Processor for Quest Weaver
 * Executes game actions based on parsed player commands
 */

import { GameSystems } from './game-systems';
import { CommandParser, ParsedCommand } from './command-parser';
import { PlayerInteractionResult } from './player-interaction';

export interface ActionEffect {
  type: 'light' | 'burn' | 'break' | 'activate' | 'consume' | 'transform' | 'interact';
  target: string; // What was affected
  magnitude?: number; // Intensity of effect (0-1)
  description: string;
}

export interface CommandExecutionResult {
  success: boolean;
  message: string;
  primaryAction: string; // The main action that was performed
  effects?: ActionEffect[]; // Multiple effects that occurred
  data?: any; // Additional data if needed (like inventory items)
}

export class CommandProcessor {
  private gameSystems: GameSystems;
  private commandParser: CommandParser;
  
  // Define composite actions that trigger multiple effects
  private compositeActions = new Map<string, string[]>([
    ['ignite', ['light', 'burn']], // Igniting something both lights it AND burns it
    ['smash', ['break', 'destroy']], // Smashing both breaks and destroys
    ['consume', ['eat', 'digest']], // Consuming involves eating and digesting
    ['incinerate', ['burn', 'destroy']], // Incinerate burns and destroys completely
  ]);
  
  constructor(gameSystems: GameSystems) {
    this.gameSystems = gameSystems;
    this.commandParser = new CommandParser(gameSystems);
  }
  
  /**
   * Execute multiple action effects for composite actions
   */
  private executeCompositeAction(originalAction: string, parsedCommand: ParsedCommand): CommandExecutionResult {
    const subActions = this.compositeActions.get(originalAction);
    if (!subActions) {
      // Fallback to single action
      return this.executeSingleAction(originalAction, parsedCommand);
    }
    
    const effects: ActionEffect[] = [];
    let combinedMessage = '';
    let primarySuccess = false;
    
    // Execute each sub-action
    for (const subAction of subActions) {
      const result = this.executeSingleAction(subAction, parsedCommand);
      if (result.success) {
        primarySuccess = true;
        if (result.effects) {
          effects.push(...result.effects);
        } else {
          // Create effect from single action result
          effects.push({
            type: subAction as any,
            target: parsedCommand.item || 'target',
            description: result.message
          });
        }
        
        if (combinedMessage) {
          combinedMessage += ' ';
        }
        combinedMessage += result.message;
      }
    }
    
    return {
      success: primarySuccess,
      message: combinedMessage || `You attempt to ${originalAction} ${parsedCommand.item || 'something'}.`,
      primaryAction: originalAction,
      effects: effects.length > 0 ? effects : undefined
    };
  }
  
  /**
   * Execute a single action (used by both simple and composite actions)
   */
  private executeSingleAction(action: string, parsedCommand: ParsedCommand): CommandExecutionResult {
    const tempCommand = { ...parsedCommand, action: action as any };
    
    switch (action) {
      case 'move':
      case 'go':
        return this.handleMoveCommand(tempCommand);
      case 'use':
        return this.handleUseCommand(tempCommand);
      case 'open':
        return this.handleOpenCommand(tempCommand);
      case 'close':
        return this.handleCloseCommand(tempCommand);
      case 'take':
      case 'get':
      case 'grab':
      case 'pick':
        return this.handleTakeCommand(tempCommand);
      case 'drop':
        return this.handleDropCommand(tempCommand);
      case 'throw':
        return this.handleThrowCommand(tempCommand);
      case 'examine':
        return this.handleExamineCommand(tempCommand);
      case 'break':
        return this.handleBreakCommand(tempCommand);
      case 'hold':
        return this.handleHoldCommand(tempCommand);
      case 'burn':
        return this.handleBurnCommand(tempCommand);
      case 'light':
      case 'activate':
        return this.handleActivateCommand(tempCommand);
      case 'attack':
        return this.handleAttackCommand(tempCommand);
      case 'talk':
        return this.handleTalkCommand(tempCommand);
      case 'eat':
        return this.handleEatCommand(tempCommand);
      case 'drink':
        return this.handleDrinkCommand(tempCommand);
      case 'cut':
        return this.handleCutCommand(tempCommand);
      case 'climb':
        return this.handleClimbCommand(tempCommand);
      case 'jump':
        return this.handleJumpCommand(tempCommand);
      case 'pull':
        return this.handlePullCommand(tempCommand);
      case 'push':
        return this.handlePushCommand(tempCommand);
      case 'turn':
        return this.handleTurnCommand(tempCommand);
      case 'wear':
        return this.handleWearCommand(tempCommand);
      case 'remove':
        return this.handleRemoveCommand(tempCommand);
      case 'give':
      case 'offer':
      case 'trade':
        return this.handleGiveCommand(tempCommand);
      case 'interface':
      case 'communicate':
        return this.handleInterfaceCommand(tempCommand);
      case 'scan':
        return this.handleScanCommand(tempCommand);
      case 'upload':
        return this.handleUploadCommand(tempCommand);
      case 'calibrate':
        return this.handleCalibrateCommand(tempCommand);
      case 'combine':
      case 'attach':
        return this.handleCombineCommand(tempCommand);
      case 'read':
        return this.handleReadCommand(tempCommand);
      case 'prepare':
        return this.handlePrepareCommand(tempCommand);
      case 'wave':
        return this.handleWaveCommand(tempCommand);
      case 'cast':
        return this.handleCastCommand(tempCommand);
      case 'position':
        return this.handlePositionCommand(tempCommand);
      case 'smash':
        return this.handleBreakCommand(tempCommand); // Smash uses break handler
      case 'incinerate':
        return this.handleBurnCommand(tempCommand); // Incinerate uses burn handler  
      case 'consume':
        return this.handleEatCommand(tempCommand); // Consume uses eat handler
      case 'look':
        return this.handleLookCommand();
      case 'inventory':
        return this.handleInventoryCommand();
      case 'help':
        return this.handleHelpCommand();
      default:
        return {
          success: false,
          message: "I don't know how to do that yet.",
          primaryAction: action
        };
    }
  }

  /**
   * Process a player command
   */
  processCommand(input: string): CommandExecutionResult {
    // Parse the command
    const parsedCommand = this.commandParser.parseCommand(input);
    if (!parsedCommand) {
      return {
        success: false,
        message: "I don't understand that command. Try 'help' for a list of commands.",
        primaryAction: 'unknown'
      };
    }
    
    // Check if this is a composite action first
    if (this.compositeActions.has(parsedCommand.action)) {
      return this.executeCompositeAction(parsedCommand.action, parsedCommand);
    }
    
    // Execute single action
    return this.executeSingleAction(parsedCommand.action, parsedCommand);
  }
  
  private handleMoveCommand(command: ParsedCommand): CommandExecutionResult {
    // In a real implementation, this would move the player
    return {
      success: true,
      message: "You move through the door...",
      primaryAction: 'move'
    };
  }
  
  private handleUseCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to use?"
      };
    }
    
    // In a real implementation, this would check inventory and use the item
    return {
      success: true,
      message: `You use ${command.item}.`
    };
  }
  
  private handleOpenCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to open?"
      };
    }
    
    // In a real implementation, this would check inventory and open the container
    return {
      success: true,
      message: `You open ${command.item}.`
    };
  }
  
  private handleTakeCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to take?",
        primaryAction: 'take'
      };
    }
    
    // In a real implementation, this would check inventory and add item
    return {
      success: true,
      message: `You take ${command.item}.`,
      primaryAction: 'take'
    };
  }
  
  private handleThrowCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to throw?"
      };
    }
    
    // In a real implementation, this would check inventory and throw the item
    return {
      success: true,
      message: `You throw ${command.item} at the brambles!`
    };
  }
  
  private handleLookCommand(): CommandExecutionResult {
    // In a real implementation, this would describe the current room
    return {
      success: true,
      message: "You look around..."
    };
  }
  
  private handleInventoryCommand(): CommandExecutionResult {
    // In a real implementation, this would list player's inventory
    return {
      success: true,
      message: "Your inventory is empty."
    };
  }
  
  private handleHelpCommand(): CommandExecutionResult {
    return {
      success: true,
      message: "Available commands:\
- 'I want to move north'\
- 'I want to open chest'\
- 'I want to use potion'\
- 'I want to take sword'\
- 'I want to throw potion at brambles'\
- 'I want to examine item'\
- 'I want to break item'\
- 'I want to hold item'\
- 'I want to burn item'\
- 'look'\
- 'inventory'"
    };
  }
  
  private handleExamineCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to examine?"
      };
    }
    
    // In a real implementation, this would examine the item and provide details
    return {
      success: true,
      message: `You examine ${command.item}. It looks interesting.`
    };
  }
  
  private handleBreakCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to break?"
      };
    }
    
    // In a real implementation, this would break the item if possible
    return {
      success: true,
      message: `You break ${command.item}. It shatters into pieces.`
    };
  }
  
  private handleHoldCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to hold?"
      };
    }
    
    // In a real implementation, this would hold or pick up the item
    return {
      success: true,
      message: `You hold ${command.item} in your hands.`
    };
  }
  
  private handleBurnCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to burn?"
      };
    }
    
    // In a real implementation, this would burn the item if possible
    return {
      success: true,
      message: `You burn ${command.item}. It catches fire and burns away.`
    };
  }

  private handleCloseCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to close?"
      };
    }
    
    return {
      success: true,
      message: `You close ${command.item}.`
    };
  }

  private handleDropCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to drop?"
      };
    }
    
    return {
      success: true,
      message: `You drop ${command.item} on the ground.`
    };
  }

  private handleAttackCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to attack?"
      };
    }
    
    return {
      success: true,
      message: `You attack ${command.item} fiercely!`
    };
  }

  private handleTalkCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "Who do you want to talk to?"
      };
    }
    
    return {
      success: true,
      message: `You try to talk to ${command.item}, but get no response.`
    };
  }

  private handleEatCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to eat?"
      };
    }
    
    return {
      success: true,
      message: `You eat ${command.item}. It tastes... interesting.`
    };
  }

  private handleDrinkCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to drink?"
      };
    }
    
    return {
      success: true,
      message: `You drink ${command.item}. It's refreshing!`
    };
  }

  private handleCutCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to cut?"
      };
    }
    
    return {
      success: true,
      message: `You cut ${command.item} with precision.`
    };
  }

  private handleClimbCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to climb?"
      };
    }
    
    return {
      success: true,
      message: `You climb ${command.item} carefully.`
    };
  }

  private handleJumpCommand(command: ParsedCommand): CommandExecutionResult {
    if (command.item) {
      return {
        success: true,
        message: `You jump over ${command.item}.`
      };
    } else {
      return {
        success: true,
        message: "You jump in place enthusiastically!"
      };
    }
  }

  private handlePullCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to pull?"
      };
    }
    
    return {
      success: true,
      message: `You pull ${command.item} with all your might.`
    };
  }

  private handlePushCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to push?"
      };
    }
    
    return {
      success: true,
      message: `You push ${command.item} firmly.`
    };
  }

  private handleTurnCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to turn?"
      };
    }
    
    return {
      success: true,
      message: `You turn ${command.item} around.`
    };
  }

  private handleWearCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to wear?"
      };
    }
    
    return {
      success: true,
      message: `You put on ${command.item}.`
    };
  }

  private handleRemoveCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to remove?"
      };
    }
    
    return {
      success: true,
      message: `You remove ${command.item}.`
    };
  }

  private handleGiveCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to give?"
      };
    }
    
    const target = command.target || "someone";
    return {
      success: true,
      message: `You give ${command.item} to ${target}.`
    };
  }

  private handleActivateCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to activate?"
      };
    }
    
    return {
      success: true,
      message: `You activate ${command.item}. It hums to life.`
    };
  }

  private handleInterfaceCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to interface with?"
      };
    }
    
    return {
      success: true,
      message: `You establish an interface with ${command.item}. Connection established.`
    };
  }

  private handleScanCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: true,
        message: "You scan the area with your equipment."
      };
    }
    
    return {
      success: true,
      message: `You scan ${command.item} with your sensors. Data collected.`
    };
  }

  private handleUploadCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to upload?"
      };
    }
    
    const target = command.target || "the system";
    return {
      success: true,
      message: `You upload ${command.item} to ${target}. Transfer complete.`
    };
  }

  private handleCalibrateCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to calibrate?"
      };
    }
    
    return {
      success: true,
      message: `You carefully calibrate ${command.item}. Settings adjusted.`
    };
  }

  private handleCombineCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to combine?"
      };
    }
    
    const target = command.target || "something";
    return {
      success: true,
      message: `You combine ${command.item} with ${target}. They work together perfectly!`
    };
  }

  private handleReadCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to read?"
      };
    }
    
    return {
      success: true,
      message: `You read ${command.item} carefully and learn its secrets.`
    };
  }

  private handlePrepareCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to prepare?"
      };
    }
    
    return {
      success: true,
      message: `You carefully prepare ${command.item}. It's ready for use.`
    };
  }

  private handleWaveCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: true,
        message: "You wave your hands around enthusiastically!"
      };
    }
    
    return {
      success: true,
      message: `You wave ${command.item} around with mystical intent.`
    };
  }

  private handleCastCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What spell do you want to cast?"
      };
    }
    
    return {
      success: true,
      message: `You cast ${command.item}! Magical energy flows through the air.`
    };
  }

  private handlePositionCommand(command: ParsedCommand): CommandExecutionResult {
    if (!command.item) {
      return {
        success: false,
        message: "What do you want to position?"
      };
    }
    
    const target = command.target || "nearby";
    return {
      success: true,
      message: `You carefully position ${command.item} ${target}.`
    };
  }
}
