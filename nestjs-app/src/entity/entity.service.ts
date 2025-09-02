import { Injectable } from '@nestjs/common';
import { IBaseEntity, IEntity } from './entity.interface';

@Injectable()
export class EntityService {
  private entities: Map<string, IEntity> = new Map();
  
  createEntity(entityData: Omit<IEntity, 'id'>): IEntity {
    const entity: IEntity = {
      ...entityData,
      id: this.generateId(),
    };
    
    this.entities.set(entity.id, entity);
    return entity;
  }
  
  getEntity(id: string): IEntity | undefined {
    return this.entities.get(id);
  }
  
  getAllEntities(): IEntity[] {
    return Array.from(this.entities.values());
  }
  
  updateEntity(id: string, updates: Partial<IEntity>): boolean {
    const entity = this.entities.get(id);
    if (!entity) return false;
    
    Object.assign(entity, updates);
    return true;
  }
  
  deleteEntity(id: string): boolean {
    return this.entities.delete(id);
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}