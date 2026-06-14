import { api } from './api';

export interface Booking {
  id_booking: number;
  id_customer: number;
  id_room: number;
  date_in: string;
  date_out: string;
  total_payment: number;
  status_payment: 'pending' | 'paid' | 'cancelled';
}

export function getBookings() {
  return api.list<Booking[]>('bookings');
}

export function createBooking(body: {
  id_customer: number;
  id_room: number;
  date_in: string;
  date_out: string;
  total_payment: number;
}) {
  return api.create<Booking>('bookings', { ...body, status_payment: 'pending' });
}

export function updateBooking(id: number, body: Partial<Booking>) {
  return api.update<Booking>('bookings', id, body);
}

export function deleteBooking(id: number) {
  return api.del<{ message: string }>('bookings', id);
}
