import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    // Cache-Control for public GET endpoints (excluding /admin, /auth, /dashboard, /health)
    if (
      req.method === 'GET' &&
      !req.path?.includes('/admin') &&
      !req.path?.includes('/auth') &&
      !req.path?.includes('/dashboard') &&
      !req.path?.includes('/health') &&
      !res.getHeader?.('Cache-Control')
    ) {
      res.setHeader(
        'Cache-Control',
        'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
      );
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: res.statusCode,
        data,
      })),
    );
  }
}
