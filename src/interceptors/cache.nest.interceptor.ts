import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheNestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheNestInterceptor.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = this.generateCacheKey(request);

    const cachedData = await this.cacheManager.get(key);

    if (cachedData) {
      this.logger.log(`Cache hit for key: ${key}`);
      return of(cachedData);
    }

    this.logger.log(`Cache miss for key: ${key}. Proceeding to handler...`);

    return next.handle().pipe(
        tap(async (data) => {
          this.logger.log(`Saving data to cache for key: ${key}`);
          await this.cacheManager.set(key, data, 30000);
        }),
    );
  }

  private generateCacheKey(request: any): string {
    return `${request.method}-${request.url}`;
  }
}