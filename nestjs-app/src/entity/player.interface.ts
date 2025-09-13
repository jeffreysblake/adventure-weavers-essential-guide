import { IEntity } from './entity.interface';

export interface IPlayer extends IEntity {
  health: number;
  inventory: any[];
  level: number;
  experience: number;
  gameId?: string;
}