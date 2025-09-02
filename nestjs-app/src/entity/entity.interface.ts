export interface BaseEntityComponent {
  id: string;
  name: string;
  active?: boolean;
  type?: string;
}

export interface Entity {
  id: string;
  name: string;
  position: { x: number; y: number };
  components: BaseEntityComponent[];
  active: boolean;
}