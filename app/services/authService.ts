import { loginRequest, postPublic } from './api';

export async function login(email: string, password: string, role: string) {
  return loginRequest(email, password, role);
}

export async function registerCustomer(name: string, email: string, password: string, phone_number?: string) {
  const body: Record<string, any> = { name, email, password };
  if (phone_number) body.phone_number = phone_number;
  return postPublic<{ id_customer: number; name: string; email: string; phone_number?: string }>('/api/register', body);
}

