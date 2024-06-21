import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class NestCacheService {
  private readonly logger = new Logger(NestCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get(key);
  }

  async set<T>(key: string, value: T, ttl): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (e) {
      this.logger.error(`Error saving data in memory cache: ${e.message}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (e) {
      this.logger.error(`Error deleting data from memory cache: ${e.message}`);
    }
  }
}
