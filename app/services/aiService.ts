import { postPublic } from './api';

export function getAiRecommendation(message: string) {
  return postPublic<{ reply: string }>('/ai-recommend', { message });
}

export function getAiTravelPlan(id_booking: number, message?: string) {
  return postPublic<{ reply: string }>('/ai-travel-plan', {
    id_booking,
    message: message || '',
  });
}
