const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('dashen_token');
}

export function setSession({ token, user }) {
  localStorage.setItem('dashen_token', token);
  localStorage.setItem('dashen_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('dashen_token');
  localStorage.removeItem('dashen_user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('dashen_user');
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
