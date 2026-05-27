'use client';

import axios, { type AxiosInstance } from 'axios';

export const AUTH_TOKEN_KEY = 'salary_auth_token';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_API_URL_PROD ??
      'https://salary-management-api-server.onrender.com')
    : (process.env.NEXT_PUBLIC_API_URL_DEV ?? 'http://localhost:4000');

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function clearToken(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function isOnLoginRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/login';
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use((config) => {
    const token = readToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        clearToken();
        if (typeof window !== 'undefined' && !isOnLoginRoute()) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const apiClient = createApiClient();

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return readToken();
}

export function clearAuthToken(): void {
  clearToken();
}
