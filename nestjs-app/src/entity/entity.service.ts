import { Injectable } from '@nestjs/common';
import { CreateEntityDto, UpdateEntityDto } from './entity.dto';

export interface Entity {
  id: string;
  name: string;
  position: { x: number; y: number };
  active: boolean;
}

@Injectable()
export class EntityService {
  private entities: Map<string, Entity> = new Map();

  create(createEntityDto: CreateEntityDto): Entity {
    const entity: Entity = {
      id: this.generateId(),
      name: createEntityDto.name,
      position: createEntityDto.position,
      active: createEntityDto.active,
    };
    
    this.entities.set(entity.id, entity);
    return entity;
  }

  findAll(): Entity[] {
    return Array.from(this.entities.values());
  }

  findOne(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  update(id: string, updateEntityDto: UpdateEntityDto): Entity | undefined {
    const existingEntity = this.entities.get(id);
    
    if (!existingEntity) {
      return undefined;
    }
    
    const updatedEntity: Entity = {
      ...existingEntity,
      ...(updateEntityDto.name !== undefined && { name: updateEntityDto.name }),
      ...(updateEntityDto.position !== undefined && { position: updateEntityDto.position }),
      ...(updateEntityDto.active !== undefined && { active: updateEntityDto.active }),
    };
    
    this.entities.set(id, updatedEntity);
    return updatedEntity;
  }

  remove(id: string): boolean {
    return this.entities.delete(id);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}