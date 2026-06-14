import { api } from './api';

export interface Review {
  id_review: number;
  id_customer: number;
  id_room: number;
  rating: number;
  comment: string;
}

export function getReviews() {
  return api.list<Review[]>('reviews');
}
