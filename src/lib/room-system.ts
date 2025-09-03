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
  position: Position;
  size: Size;
  connections: Record<string, Connection>; // key is room ID
}

export interface Connection {
  roomId: string; // The connected room's ID
  direction: 'north' | 'south' | 'east' | 'west';
  locked?: boolean;
  requiresKey?: string;
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
    position: Position,
    size: Size,
    connections?: Record<string, Connection>
  ): Room {
    const room: Room = {
      id,
      name,
      description,
      position,
      size,
      connections: connections || {}
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
    requiresKey?: string
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
      requiresKey
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
}