import { Injectable } from '@nestjs/common';
import { EntityService } from './entity.service';
import { IRoom } from './room.interface';

@Injectable()
export class RoomService {
  private rooms: Map<string, IRoom> = new Map();
  
  constructor(private readonly entityService: EntityService) {}
  
  createRoom(roomData: Omit<IRoom, 'id' | 'type'>): IRoom {
    const room: IRoom = {
      ...roomData,
      id: this.generateId(),
      type: 'room',
      objects: [],
      players: [],
    };
    
    this.rooms.set(room.id, room);
    return room;
  }
  
  getRoom(id: string): IRoom | undefined {
    return this.rooms.get(id);
  }
  
  getAllRooms(): IRoom[] {
    return Array.from(this.rooms.values());
  }
  
  addPlayerToRoom(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    // Check if player exists
    const player = this.entityService.getEntity(playerId);
    if (!player) return false;
    
    if (!room.players.includes(playerId)) {
      room.players.push(playerId);
      return true;
    }
    return false;
  }
  
  addObjectToRoom(roomId: string, objectId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    // Check if object exists
    const obj = this.entityService.getEntity(objectId);
    if (!obj) return false;
    
    if (!room.objects.includes(objectId)) {
      room.objects.push(objectId);
      return true;
    }
    return false;
  }
  
  getRoomEntities(roomId: string): { players: string[], objects: string[] } {
    const room = this.rooms.get(roomId);
    if (!room) return { players: [], objects: [] };
    
    return {
      players: room.players,
      objects: room.objects
    };
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}