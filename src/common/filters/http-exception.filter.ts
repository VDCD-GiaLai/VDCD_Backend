import {
    ExceptionFilter, Catch, ArgumentsHost,
    HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private logger = new Logger('Exception');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException ? exception.getResponse() : null;

        const message =
            typeof exceptionResponse === 'object' && exceptionResponse !== null
                ? (exceptionResponse as any).message
                : exception instanceof Error
                    ? exception.message
                    : 'Internal server error';

        // Only log 5xx — 4xx are client errors, no need to alert
        if (status >= 500) {
            this.logger.error(
                `${req.method} ${req.url} — ${status}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        }

        res.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: req.url,
        });
    }
}