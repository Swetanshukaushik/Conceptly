import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

function bool(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

export const runtimeConfig = {
  useMockData:
    typeof process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'string'
      ? bool(process.env.EXPO_PUBLIC_USE_MOCK_DATA, true)
      : bool(extra.useMockData, true),
  apiBaseUrl:
    typeof process.env.EXPO_PUBLIC_API_BASE_URL === 'string'
      ? process.env.EXPO_PUBLIC_API_BASE_URL
      : typeof extra.apiBaseUrl === 'string'
      ? extra.apiBaseUrl
      : ''
} as const;

