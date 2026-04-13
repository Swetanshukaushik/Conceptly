import { runtimeConfig } from '@/constants/runtimeConfig';

export async function apiGet<T>(path: string): Promise<T> {
  if (!runtimeConfig.apiBaseUrl) {
    throw new Error('API base URL is not configured');
  }

  const response = await fetch(`${runtimeConfig.apiBaseUrl}${path}`);
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

  // Check if response has content before parsing JSON
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
  if (!runtimeConfig.apiBaseUrl) {
    throw new Error('API base URL is not configured');
  }

  const response = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
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

  // Check if response has content before parsing JSON
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
  if (!runtimeConfig.apiBaseUrl) {
    throw new Error('API base URL is not configured');
  }

  const response = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
}

