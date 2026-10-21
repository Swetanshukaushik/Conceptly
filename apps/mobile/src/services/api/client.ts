import { runtimeConfig } from '@/constants/runtimeConfig';
import { useAppStore } from '@/store/useAppStore';

function getApiBaseUrl(): string {
  if (runtimeConfig.apiBaseUrl && runtimeConfig.apiBaseUrl.trim() !== '') {
    return runtimeConfig.apiBaseUrl;
  }
  return 'http://localhost:3000/v1';
}

function normalizePath(path: string): string {
  if (path.startsWith('/v1/')) {
    return path.substring(3);
  }
  return path.startsWith('/') ? path : `/${path}`;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const store = useAppStore.getState();
    if (store.authToken) {
      headers['Authorization'] = `Bearer ${store.authToken}`;
    } else {
      headers['x-user-id'] = 'usr_demo_student';
    }
  } catch {
    // In environments where Zustand store isn't ready
  }

  return headers;
}

export async function apiGet<T>(path: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const response = await fetch(`${baseUrl}${normalizePath(path)}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage += ` - ${errorText}`;
      }
    } catch {
      // Ignore error when trying to read error response
    }
    throw new Error(errorMessage);
  }

  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || response.status === 204) {
    return undefined as T;
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
}

export async function apiPost<T>(path: string, body: Record<string, any>): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const response = await fetch(`${baseUrl}${normalizePath(path)}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage += ` - ${errorText}`;
      }
    } catch {
      // Ignore error when trying to read error response
    }
    throw new Error(errorMessage);
  }

  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || response.status === 204) {
    return undefined as T;
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
}

export async function apiDelete(path: string): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const response = await fetch(`${baseUrl}${normalizePath(path)}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
}
