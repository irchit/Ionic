// src/services/api.ts
import { getToken } from './auth';

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  
  return fetch(url, { ...options, headers });
}
