export interface IBaseEntity {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  type: 'player' | 'object' | 'room';
}

export interface IInteractionResult {
  success: boolean;
  message: string;
  effects?: {
    [key: string]: any;
  };
}

export interface IEntity extends IBaseEntity {
  health?: number;
  inventory?: any[];
  interactWith?(other: IEntity): IInteractionResult;
}