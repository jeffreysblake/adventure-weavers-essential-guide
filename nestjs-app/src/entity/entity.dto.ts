export class CreateEntityDto {
  name: string;
  position: { x: number; y: number };
  active: boolean;
}

export class UpdateEntityDto {
  id: string;
  name?: string;
  position?: { x: number; y: number };
  active?: boolean;
}