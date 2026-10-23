import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: number;
}

const CACHE_VERSION = 1;
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

class OfflineCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  private getStorageKey(key: string): string {
    return `conceptly_offline_v${CACHE_VERSION}:${key}`;
  }

  isOnline(): boolean {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      return navigator.onLine !== false;
    }
    return true;
  }

  async get<T>(key: string, maxAgeMs: number = DEFAULT_TTL_MS): Promise<T | null> {
    // 1. Check in-memory fast tier
    const inMem = this.memoryCache.get(key);
    if (inMem) {
      if (Date.now() - inMem.timestamp < maxAgeMs) {
        return inMem.data as T;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check persistent storage tier
    const storageKey = this.getStorageKey(key);
    try {
      let raw: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(storageKey);
      } else {
        raw = await AsyncStorage.getItem(storageKey);
      }

      if (!raw) return null;

      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() - entry.timestamp < maxAgeMs) {
        // Hydrate fast tier
        this.memoryCache.set(key, entry);
        return entry.data;
      }

      // Expired: clean up
      await this.remove(key);
      return null;
    } catch (e) {
      console.warn(`[OfflineCache] Error reading key "${key}":`, e);
      return null;
    }
  }

  async set<T>(key: string, data: T): Promise<void> {
    if (data === undefined || data === null) return;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };

    // Update memory
    this.memoryCache.set(key, entry);

    // Update persistent storage
    const storageKey = this.getStorageKey(key);
    try {
      const serialized = JSON.stringify(entry);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, serialized);
      } else {
        await AsyncStorage.setItem(storageKey, serialized);
      }
    } catch (e) {
      console.warn(`[OfflineCache] Error writing key "${key}":`, e);
    }
  }

  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    const storageKey = this.getStorageKey(key);
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(storageKey);
      } else {
        await AsyncStorage.removeItem(storageKey);
      }
    } catch (e) {
      console.warn(`[OfflineCache] Error removing key "${key}":`, e);
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(`conceptly_offline_v${CACHE_VERSION}:`)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      } else {
        const allKeys = await AsyncStorage.getAllKeys();
        const appKeys = allKeys.filter((k) => k.startsWith(`conceptly_offline_v${CACHE_VERSION}:`));
        if (appKeys.length > 0) {
          if (typeof AsyncStorage.removeMany === 'function') {
            await AsyncStorage.removeMany(appKeys);
          } else {
            await Promise.all(appKeys.map((k) => AsyncStorage.removeItem(k)));
          }
        }
      }
    } catch (e) {
      console.warn('[OfflineCache] Error clearing cache:', e);
    }
  }
}

export const offlineCache = new OfflineCache();
