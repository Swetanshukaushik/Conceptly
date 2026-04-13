import Constants from 'expo-constants';

function parseBoolean(value: unknown): boolean | undefined {
  if (value == null) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    if (value === '1') return true;
    if (value === '0') return false;
  }
  if (typeof value === 'number') return value === 1;
  return undefined;
}

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

const useMockDataFromExtra = parseBoolean(extra.useMockData);
const useMockDataFromEnv = parseBoolean(
  process.env.EXPO_PUBLIC_USE_MOCK_DATA
);

export const useMockData =
  useMockDataFromExtra ?? useMockDataFromEnv ?? true;

export const apiBaseUrl =
  typeof process.env.EXPO_PUBLIC_API_BASE_URL === 'string'
    ? process.env.EXPO_PUBLIC_API_BASE_URL
    : '';

