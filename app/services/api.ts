const BASE_URL = 'https://getup-zips-buckskin.ngrok-free.dev';

let _token: string | null = null;

export function setToken(token: string | null) {
  _token = token;
}

export function getToken(): string | null {
  return _token;
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  // Handle empty response body
  if (!text) {
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status} (empty response)`);
    }
    return {} as T;
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server returned invalid JSON (status ${res.status})`);
  }

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  /** GET /api/{resource} */
  list: <T = any>(resource: string): Promise<T> =>
    fetch(`${BASE_URL}/api/${resource}`, { headers: authHeaders() })
      .then((res) => handleResponse<T>(res)),

  /** GET /api/{resource}/{id} */
  get: <T = any>(resource: string, id: number | string): Promise<T> =>
    fetch(`${BASE_URL}/api/${resource}/${id}`, { headers: authHeaders() })
      .then((res) => handleResponse<T>(res)),

  /** POST /api/{resource} */
  create: <T = any>(resource: string, body: Record<string, any>): Promise<T> =>
    fetch(`${BASE_URL}/api/${resource}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then((res) => handleResponse<T>(res)),

  /** PUT /api/{resource}/{id} */
  update: <T = any>(resource: string, id: number | string, body: Record<string, any>): Promise<T> =>
    fetch(`${BASE_URL}/api/${resource}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then((res) => handleResponse<T>(res)),

  /** DELETE /api/{resource}/{id} */
  del: <T = any>(resource: string, id: number | string): Promise<T> =>
    fetch(`${BASE_URL}/api/${resource}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then((res) => handleResponse<T>(res)),
};

/**
 * POST to a custom path (not under /api/).
 * Used for endpoints like /ai-recommend.
 */
export async function postPublic<T = any>(path: string, body: Record<string, any>): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

/**
 * POST /api/login — public, no auth header.
 */
export async function loginRequest(email: string, password: string, role: string) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    body: JSON.stringify({ email, password, role }),
  });
  return handleResponse<{ token: string; user: { id: number; name: string; email: string; role: string } }>(res);
}
