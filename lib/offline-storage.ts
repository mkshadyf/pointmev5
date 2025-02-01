import localforage from "localforage";

// Configure localforage
localforage.config({
  name: "pointme",
  storeName: "app_store",
});

interface CacheConfig {
  expiry?: number; // Time in milliseconds
  version?: string;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  version: string;
}

interface OfflineAction {
  type: string;
  payload: unknown;
  timestamp: number;
}

const APP_VERSION = "1.0.0";

export class OfflineStorage {
  private static instance: OfflineStorage;
  private store: typeof localforage;

  private constructor() {
    this.store = localforage;
  }

  public static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  private generateKey(key: string): string {
    return `pointme_${key}`;
  }

  private isExpired(timestamp: number, expiry?: number): boolean {
    if (!expiry) return false;
    return Date.now() - timestamp > expiry;
  }

  async set<T>(
    key: string,
    data: T,
    config: CacheConfig = {}
  ): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      version: config.version || APP_VERSION,
    };
    await this.store.setItem(this.generateKey(key), cacheItem);
  }

  async get<T>(
    key: string,
    config: CacheConfig = {}
  ): Promise<T | null> {
    const cacheItem = await this.store.getItem<CacheItem<T>>(
      this.generateKey(key)
    );

    if (!cacheItem) return null;

    // Version check
    if (config.version && cacheItem.version !== config.version) {
      await this.remove(key);
      return null;
    }

    // Expiry check
    if (this.isExpired(cacheItem.timestamp, config.expiry)) {
      await this.remove(key);
      return null;
    }

    return cacheItem.data;
  }

  async remove(key: string): Promise<void> {
    await this.store.removeItem(this.generateKey(key));
  }

  async clear(): Promise<void> {
    await this.store.clear();
  }

  // Utility methods for common data types
  async setServices(services: any[]): Promise<void> {
    await this.set("services", services, {
      expiry: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  async getServices(): Promise<any[] | null> {
    return this.get("services");
  }

  async setUserProfile(profile: any): Promise<void> {
    await this.set("profile", profile, {
      expiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async getUserProfile(): Promise<any | null> {
    return this.get("profile");
  }

  async setBookings(bookings: any[]): Promise<void> {
    await this.set("bookings", bookings, {
      expiry: 12 * 60 * 60 * 1000, // 12 hours
    });
  }

  async getBookings(): Promise<any[] | null> {
    return this.get("bookings");
  }

  // Queue for offline actions
  async queueAction(action: OfflineAction): Promise<void> {
    const queue = (await this.get<OfflineAction[]>("action_queue")) || [];
    queue.push(action);
    await this.set("action_queue", queue);
  }

  async getActionQueue(): Promise<OfflineAction[]> {
    return (await this.get<OfflineAction[]>("action_queue")) || [];
  }

  async clearActionQueue(): Promise<void> {
    await this.remove("action_queue");
  }
}
