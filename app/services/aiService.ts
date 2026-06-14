import { postPublic } from './api';

export function getAiRecommendation(message: string) {
  return postPublic<{ reply: string }>('/ai-recommend', { message });
}
