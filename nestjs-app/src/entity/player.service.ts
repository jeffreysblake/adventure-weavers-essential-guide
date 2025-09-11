import { Injectable } from '@nestjs/common';
import { EntityService } from './entity.service';
import { IPlayer } from './player.interface';
import { ObjectService } from './object.service';
import { IInteractionResult } from './entity.interface';
import { IObject } from './object.interface';
import { PhysicsService } from './physics.service';
import { IPhysicsEffect, EffectType } from './physics.interface';

@Injectable()
export class PlayerService {
  constructor(
    private readonly entityService: EntityService,
    private readonly objectService: ObjectService,
    private readonly physicsService: PhysicsService
  ) {}
  
  createPlayer(playerData: Omit<IPlayer, 'id' | 'type'>): IPlayer {
    const entityData = {
      ...playerData,
      type: 'player' as const,
      health: playerData.health ?? 100,
      inventory: playerData.inventory ?? [],
      level: playerData.level ?? 1,
      experience: playerData.experience ?? 0
    };
    
    // Let EntityService generate the ID and create the entity
    const entity = this.entityService.createEntity(entityData);
    return entity as IPlayer;
  }
  
  getPlayer(id: string): IPlayer | undefined {
    const entity = this.entityService.getEntity(id);
    if (entity && entity.type === 'player') {
      return entity as IPlayer;
    }
    return undefined;
  }
  
  updatePlayer(
    id: string, 
    updates: Partial<Omit<IPlayer, 'id' | 'type'>>
  ): boolean {
    const player = this.getPlayer(id);
    if (!player) return false;
    
    // Update the entity
    return this.entityService.updateEntity(id, {
      ...updates,
      type: 'player'
    });
  }
  
  addInventoryItem(playerId: string, item: any): boolean {
    const player = this.getPlayer(playerId);
    if (!player) return false;
    
    player.inventory.push(item);
    return this.updatePlayer(playerId, { inventory: player.inventory });
  }
  
  interactWithObject(playerId: string, objectId: string, action: string = 'examine'): IInteractionResult {
    const player = this.getPlayer(playerId);
    const object = this.objectService.getObject(objectId);
    
    if (!player || !object) {
      return {
        success: false,
        message: 'Player or object not found'
      };
    }
    
    switch (action) {
      case 'examine':
        return this.examineObject(player, object);
      case 'take':
      case 'pickup':
        return this.takeObject(player, object);
      case 'open':
        return this.openContainer(player, object);
      case 'close':
        return this.closeContainer(player, object);
      case 'use':
        return this.useObject(player, object);
      default:
        return {
          success: false,
          message: `Unknown action: ${action}`
        };
    }
  }
  
  private examineObject(player: IPlayer, object: IObject): IInteractionResult {
    let description = `You examine the ${object.name}.`;
    
    if (object.spatialRelationship) {
      const location = this.objectService.getObjectLocation(object.id);
      description += ` ${location}.`;
    }
    
    if (object.isContainer && object.state?.isOpen) {
      const contents = this.objectService.getObjectsInContainer(object.id);
      if (contents.length > 0) {
        const itemNames = contents.map(item => item.name).join(', ');
        description += ` Inside you see: ${itemNames}.`;
      } else {
        description += ' It is empty.';
      }
    }
    
    return {
      success: true,
      message: description
    };
  }
  
  private takeObject(player: IPlayer, object: IObject): IInteractionResult {
    if (!object.isPortable) {
      return {
        success: false,
        message: `You cannot take the ${object.name}.`
      };
    }
    
    // Remove from current location
    if (object.spatialRelationship?.relationshipType === 'inside') {
      this.objectService.removeObjectFromContainer(object.id, object.spatialRelationship.targetId);
    }
    
    // Add to player inventory
    player.inventory.push(object.id);
    object.spatialRelationship = undefined;
    
    this.updatePlayer(player.id, { inventory: player.inventory });
    this.entityService.updateEntity(object.id, object);
    
    return {
      success: true,
      message: `You take the ${object.name}.`,
      effects: {
        itemTaken: object.id
      }
    };
  }
  
  private openContainer(player: IPlayer, object: IObject): IInteractionResult {
    if (!object.isContainer) {
      return {
        success: false,
        message: `The ${object.name} cannot be opened.`
      };
    }
    
    if (object.state?.isLocked) {
      return {
        success: false,
        message: `The ${object.name} is locked.`
      };
    }
    
    if (object.state?.isOpen) {
      return {
        success: false,
        message: `The ${object.name} is already open.`
      };
    }
    
    object.state = { ...object.state, isOpen: true };
    this.entityService.updateEntity(object.id, object);
    
    return {
      success: true,
      message: `You open the ${object.name}.`,
      effects: {
        containerOpened: object.id
      }
    };
  }
  
  private closeContainer(player: IPlayer, object: IObject): IInteractionResult {
    if (!object.isContainer) {
      return {
        success: false,
        message: `The ${object.name} cannot be closed.`
      };
    }
    
    if (!object.state?.isOpen) {
      return {
        success: false,
        message: `The ${object.name} is already closed.`
      };
    }
    
    object.state = { ...object.state, isOpen: false };
    this.entityService.updateEntity(object.id, object);
    
    return {
      success: true,
      message: `You close the ${object.name}.`,
      effects: {
        containerClosed: object.id
      }
    };
  }
  
  private useObject(player: IPlayer, object: IObject): IInteractionResult {
    // Basic use implementation - can be extended based on object type
    switch (object.objectType) {
      case 'weapon':
        return {
          success: true,
          message: `You brandish the ${object.name}.`
        };
      case 'consumable':
        // Remove from inventory if consumed
        const index = player.inventory.indexOf(object.id);
        if (index > -1) {
          player.inventory.splice(index, 1);
          this.updatePlayer(player.id, { inventory: player.inventory });
        }
        return {
          success: true,
          message: `You use the ${object.name}.`,
          effects: {
            itemConsumed: object.id
          }
        };
      default:
        return {
          success: true,
          message: `You use the ${object.name}.`
        };
    }
  }

  // Magic/Physics Interaction Methods
  castSpell(playerId: string, spellType: EffectType, targetId: string, intensity: number = 5): IInteractionResult {
    const player = this.getPlayer(playerId);
    if (!player) {
      return {
        success: false,
        message: 'Player not found'
      };
    }

    const effect: IPhysicsEffect = {
      type: spellType,
      intensity,
      sourceId: playerId,
      description: this.getSpellDescription(spellType, intensity)
    };

    const result = this.physicsService.applyEffect(targetId, effect);
    
    return {
      success: result.success,
      message: `${player.name} casts ${this.getSpellName(spellType)}! ${result.message}`,
      effects: {
        physicsResult: result
      }
    };
  }

  castAreaSpell(playerId: string, spellType: EffectType, roomId: string, intensity: number = 5): IInteractionResult {
    const player = this.getPlayer(playerId);
    if (!player) {
      return {
        success: false,
        message: 'Player not found'
      };
    }

    const effect: IPhysicsEffect = {
      type: spellType,
      intensity,
      sourceId: playerId,
      description: this.getAreaSpellDescription(spellType, intensity)
    };

    const result = this.physicsService.applyAreaEffect(roomId, effect);
    
    return {
      success: result.success,
      message: `${player.name} casts ${this.getSpellName(spellType)} across the room! ${result.message}`,
      effects: {
        physicsResult: result
      }
    };
  }

  // Helper methods for spell descriptions
  private getSpellName(spellType: EffectType): string {
    const spellNames: Record<EffectType, string> = {
      fire: 'Fireball',
      lightning: 'Lightning Bolt',
      ice: 'Ice Shard',
      force: 'Force Push',
      poison: 'Poison Cloud',
      acid: 'Acid Splash',
      magic: 'Magic Missile'
    };
    return spellNames[spellType] || 'Unknown Spell';
  }

  private getSpellDescription(spellType: EffectType, intensity: number): string {
    const base = this.getSpellName(spellType).toLowerCase();
    if (intensity <= 3) return `weak ${base}`;
    if (intensity <= 6) return `${base}`;
    return `powerful ${base}`;
  }

  private getAreaSpellDescription(spellType: EffectType, intensity: number): string {
    const base = this.getSpellName(spellType).toLowerCase();
    if (intensity <= 3) return `spreading ${base}`;
    if (intensity <= 6) return `area ${base}`;
    return `devastating ${base} storm`;
  }
  
  // Method to persist players (in a real app, this would save to DB)
  persistPlayers(): void {
    console.log('Persisting players');
  }
  
  // Method to load persisted players (in a real app, this would read from DB)
  loadPlayers(): void {
    console.log('Loading players');
  }

  // Missing methods for game service compatibility
  movePlayer(playerId: string, newPosition: { x: number; y: number; z: number }): boolean {
    return this.updatePlayer(playerId, { position: newPosition });
  }

  addToInventory(playerId: string, itemId: string): boolean {
    const player = this.getPlayer(playerId);
    if (!player) return false;
    
    if (!player.inventory.includes(itemId)) {
      player.inventory.push(itemId);
      return this.updatePlayer(playerId, { inventory: player.inventory });
    }
    return true;
  }

  removeFromInventory(playerId: string, itemId: string): boolean {
    const player = this.getPlayer(playerId);
    if (!player) return false;
    
    const index = player.inventory.indexOf(itemId);
    if (index > -1) {
      player.inventory.splice(index, 1);
      return this.updatePlayer(playerId, { inventory: player.inventory });
    }
    return false;
  }

  getInventory(playerId: string): any[] {
    const player = this.getPlayer(playerId);
    if (!player) return [];
    
    // Return actual objects instead of just IDs
    return player.inventory.map(itemId => 
      this.objectService.getObject(itemId)
    ).filter(Boolean);
  }
  
}