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
  
  // Method to persist entities (in a real app, this would save to DB)
  persistEntities(): void {
    // In a real implementation, we'd serialize and store the entities
    // For now, just log that persistence is happening
    console.log('Persisting entities:', Array.from(this.entities.values()).length);
  }
  
  // Method to load persisted entities (in a real app, this would read from DB)
  loadEntities(): void {
    // In a real implementation, we'd deserialize and restore the entities
    // For now, just log that loading is happening
    console.log('Loading entities');
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}