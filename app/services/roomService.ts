import { api } from './api';

export interface RoomType {
  id_room_type: number;
  name: string;
  price: number;
  description: string;
}

export interface Room {
  id_room: number;
  room_number: string;
  id_room_type: number;
  availability: boolean;
  room_type: RoomType;
}

export function getRooms() {
  return api.list<Room[]>('rooms');
}

export function getRoomTypes() {
  return api.list<RoomType[]>('room-types');
}

export function updateRoomType(id: number, body: Partial<RoomType>) {
  return api.update<RoomType>('room-types', id, body);
}
