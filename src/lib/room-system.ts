/**
 * Room System for Quest Weaver
 * Handles room creation, positioning, and navigation
 */

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  narrative?: string; // Additional story context for the room
  position: Position;
  size: Size;
  connections: Record<string, Connection>; // key is room ID
  items?: string[]; // IDs of items in this room
}

export interface Connection {
  roomId: string; // The connected room's ID
  direction: 'north' | 'south' | 'east' | 'west';
  locked?: boolean;
  requiresKey?: string;
  isDoor?: boolean;
  canCrawlThrough?: boolean;
}

export class RoomSystem {
  private rooms: Map<string, Room> = new Map();
  
  /**
   * Create a new room with relative positioning
   */
  createRoom(
    id: string,
    name: string,
    description: string,
    narrative?: string,
    position: Position = { x: 0, y: 0 },
    size: Size = { width: 10, height: 10 },
    connections?: Record<string, Connection>,
    items?: string[]
  ): Room {
    const room: Room = {
      id,
      name,
      description,
      narrative,
      position,
      size,
      connections: connections || {},
      items: items || []
    };
    
    this.rooms.set(id, room);
    return room;
  }
  
  /**
   * Add a connection between rooms
   */
  addConnection(
    fromRoomId: string,
    toRoomId: string,
    direction: 'north' | 'south' | 'east' | 'west',
    locked?: boolean,
    requiresKey?: string,
    isDoor?: boolean,
    canCrawlThrough?: boolean
  ): void {
    const fromRoom = this.rooms.get(fromRoomId);
    if (!fromRoom) {
      throw new Error(`Room ${fromRoomId} not found`);
    }
    
    // Create connection object
    const connection: Connection = {
      roomId: toRoomId,
      direction,
      locked,
      requiresKey,
      isDoor,
      canCrawlThrough
    };
    
    // Add to room's connections
    if (!fromRoom.connections) {
      fromRoom.connections = {};
    }
    
    // Use the direction as key for easy lookup
    fromRoom.connections[direction] = connection;
  }
  
  /**
   * Get a room by ID
   */
  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }
  
  /**
   * Get all rooms
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
  
  /**
   * Remove a room by ID
   */
  removeRoom(id: string): boolean {
    return this.rooms.delete(id);
  }
  
  /**
   * Add an item to a room
   */
  addItemToRoom(roomId: string, itemId: string): boolean {
    const room = this.getRoom(roomId);
    if (!room) return false;
    
    if (!room.items) room.items = [];
    
    if (!room.items.includes(itemId)) {
      room.items.push(itemId);
      return true;
    }
    
    return false; // Item already in room
  }
}