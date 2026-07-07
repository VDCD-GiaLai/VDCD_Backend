import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonUtilities } from 'nest-winston';

const { combine, timestamp, errors } = winston.format;

export const loggerConfig: WinstonModuleOptions = {
    transports: [
        // Console — only use in development
        new winston.transports.Console({
            silent: process.env.NODE_ENV === 'test',
            format: combine(
                timestamp(),
                errors({ stack: true }),
                nestWinstonUtilities.format.nestLike('VDCD', {
                    prettyPrint: true,
                    colors: true,
                }),
            ),
        }),

        // File: all logs from info level
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: combine(timestamp(), errors({ stack: true }), winston.format.json()),
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 7,               // keep 7 recent files
        }),

        // File: only error
        new winston.transports.File({
            level: 'error',
            filename: 'logs/error.log',
            format: combine(timestamp(), errors({ stack: true }), winston.format.json()),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 14,
        }),
    ],
};