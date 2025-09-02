export class CreatePhysicsBodyDto {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  mass: number;
  shape: 'box' | 'sphere' | 'plane';
}

export class UpdatePhysicsBodyDto {
  id: string;
  position?: { x: number; y: number; z: number };
  velocity?: { x: number; y: number; z: number };
  mass?: number;
}