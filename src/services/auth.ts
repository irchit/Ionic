// src/services/auth.ts
import { authenticatedStorage } from './storage';

export async function login(username: string, password: string) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const { token } = await response.json();
    await authenticatedStorage.set('token', token);
    return true;
  } else {
    return false;
  }
}

export async function logout() {
  await authenticatedStorage.remove('token');
}

export async function getToken(): Promise<string | null> {
  return authenticatedStorage.get('token');
}
