import { IBaseEntity, IEntity } from './entity.interface';

export interface IRoom extends IBaseEntity {
  description?: string;
  width: number;
  height: number;
  size: {
    width: number;
    height: number;
    depth: number;
  };
  objects: string[]; // Array of object IDs
  players: string[]; // Array of player IDs
  environment?: {
    lighting?: string;
    sound?: string;
    weather?: string;
  };
}