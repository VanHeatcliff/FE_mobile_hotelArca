import { api } from './api';

export interface Chat {
  id_chat: number;
  id_customer: number;
  id_staff: number;
  date: string;
}

export interface ChatMessage {
  id_chat_message: number;
  id_chat: number;
  sender_type: 'customer' | 'staff';
  message: string;
  date: string;
}

export function getChats() {
  return api.list<Chat[]>('chats');
}

export function createChat(id_customer: number, id_staff: number) {
  return api.create<Chat>('chats', {
    id_customer,
    id_staff,
    date: new Date().toISOString(),
  });
}

export function getChatMessages(chatId: number) {
  return api.list<ChatMessage[]>(`chats/${chatId}/messages`);
}

export function sendMessage(chatId: number, sender_type: 'customer' | 'staff', message: string) {
  return api.create<ChatMessage>(`chats/${chatId}/messages`, { sender_type, message });
}
