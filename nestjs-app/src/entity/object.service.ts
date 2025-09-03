import { Injectable } from '@nestjs/common';
import { EntityService } from './entity.service';
import { IObject, ISpatialRelationship } from './object.interface';

@Injectable()
export class ObjectService {
  constructor(private readonly entityService: EntityService) {}
  
  createObject(objectData: Omit<IObject, 'id' | 'type'>): IObject {
    // Create entity data without ID first
    const entityData = {
      ...objectData,
      type: 'object' as const,
      properties: objectData.properties || {},
      containedObjects: objectData.containedObjects || [],
      canContain: objectData.canContain || false,
      isContainer: objectData.isContainer || false,
      isPortable: objectData.isPortable ?? true,
    };
    
    // Let EntityService generate the ID and create the entity
    const entity = this.entityService.createEntity(entityData);
    return entity as IObject;
  }
  
  getObject(id: string): IObject | undefined {
    const entity = this.entityService.getEntity(id);
    if (entity && entity.type === 'object') {
      return entity as IObject;
    }
    return undefined;
  }
  
  updateObject(
    id: string, 
    updates: Partial<Omit<IObject, 'id' | 'type'>>
  ): boolean {
    const object = this.getObject(id);
    if (!object) return false;
    
    // Update the entity
    return this.entityService.updateEntity(id, {
      ...updates,
      type: 'object'
    });
  }
  
  placeObject(objectId: string, relationship: ISpatialRelationship): boolean {
    const object = this.getObject(objectId);
    const target = this.entityService.getEntity(relationship.targetId);
    
    if (!object || !target) return false;
    
    // Validate placement constraints
    if (!this.canPlaceObject(object, target, relationship.relationshipType)) {
      return false;
    }
    
    // Handle container relationships
    if (relationship.relationshipType === 'inside') {
      const targetObject = target as IObject;
      if (targetObject.type === 'object' && targetObject.isContainer) {
        if (!targetObject.containedObjects) targetObject.containedObjects = [];
        if (!targetObject.containedObjects.includes(objectId)) {
          targetObject.containedObjects.push(objectId);
        }
      }
    }
    
    // Update object's spatial relationship
    object.spatialRelationship = relationship;
    return this.entityService.updateEntity(objectId, object);
  }
  
  removeObjectFromContainer(objectId: string, containerId: string): boolean {
    const container = this.getObject(containerId);
    if (!container || !container.containedObjects) return false;
    
    const index = container.containedObjects.indexOf(objectId);
    if (index > -1) {
      container.containedObjects.splice(index, 1);
      
      // Clear spatial relationship
      const object = this.getObject(objectId);
      if (object) {
        object.spatialRelationship = undefined;
        this.entityService.updateEntity(objectId, object);
      }
      
      return this.entityService.updateEntity(containerId, container);
    }
    return false;
  }
  
  getObjectsInContainer(containerId: string): IObject[] {
    const container = this.getObject(containerId);
    if (!container || !container.containedObjects) return [];
    
    return container.containedObjects
      .map(id => this.getObject(id))
      .filter(obj => obj !== undefined) as IObject[];
  }
  
  getObjectLocation(objectId: string): string {
    const object = this.getObject(objectId);
    if (!object || !object.spatialRelationship) {
      return `${object?.name || 'Unknown object'} is not placed anywhere`;
    }
    
    const target = this.entityService.getEntity(object.spatialRelationship.targetId);
    const relationship = object.spatialRelationship.relationshipType.replace('_', ' ');
    
    return object.spatialRelationship.description || 
           `${object.name} is ${relationship} ${target?.name || 'unknown target'}`;
  }
  
  private canPlaceObject(object: IObject, target: any, relationshipType: string): boolean {
    // Basic validation
    if (object.id === target.id) return false;
    
    switch (relationshipType) {
      case 'inside':
        if (target.type !== 'object') return false;
        const targetObj = target as IObject;
        if (!targetObj.isContainer || !targetObj.canContain) return false;
        if (targetObj.state?.isLocked) return false;
        
        // Container must be open to place items inside (unless it starts open)
        if (targetObj.state && targetObj.state.isOpen !== undefined && !targetObj.state.isOpen) {
          return false;
        }
        
        // Check capacity
        const currentCount = targetObj.containedObjects?.length || 0;
        const capacity = targetObj.containerCapacity || 10;
        return currentCount < capacity;
        
      case 'on_top_of':
        // Can't place on top of very small objects
        return target.type === 'object' && 
               (target as IObject).objectType === 'furniture';
        
      case 'next_to':
      case 'underneath':
      case 'attached_to':
        return true;
        
      default:
        return false;
    }
  }
  
  // Method to persist objects (in a real app, this would save to DB)
  persistObjects(): void {
    console.log('Persisting objects');
  }
  
  // Method to load persisted objects (in a real app, this would read from DB)
  loadObjects(): void {
    console.log('Loading objects');
  }
  
}