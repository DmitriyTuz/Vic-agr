import {
  CallHandler,
  ExecutionContext,
  Injectable, Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    this.logger.log(`Request processed: ${context.switchToHttp().getRequest().url}`);

    return next.handle().pipe(
      tap(() =>
          this.logger.log(`Request completed. Execution time: ${Date.now() - now}ms`)
      ),
    );
  }
}