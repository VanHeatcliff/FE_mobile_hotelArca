import { api } from './api';

export interface Payment {
  id_payment: number;
  id_booking: number;
  total_payment: number;
  method: string;
  date: string;
  status: string;
}

export function getPayments() {
  return api.list<Payment[]>('payments');
}

export function createPayment(body: {
  id_booking: number;
  total_payment: number;
  method: string;
  date: string;
  status: string;
}) {
  return api.create<Payment>('payments', body);
}
