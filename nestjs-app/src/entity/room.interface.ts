import { IBaseEntity, IEntity } from './entity.interface';

export interface IRoom extends IBaseEntity {
  width: number;
  height: number;
  objects: string[]; // Array of object IDs
  players: string[]; // Array of player IDs
  environment?: {
    lighting?: string;
    sound?: string;
    weather?: string;
  };
}