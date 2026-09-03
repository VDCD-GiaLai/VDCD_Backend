import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsInt()
  PORT: number;

  @IsString() @IsNotEmpty() DB_HOST: string;
  @IsInt() DB_PORT: number;
  @IsString() @IsNotEmpty() DB_NAME: string;
  @IsString() @IsNotEmpty() DB_USER: string;
  @IsString() @IsNotEmpty() DB_PASSWORD: string;

  @IsString() @IsNotEmpty() JWT_SECRET: string;
  @IsString() @IsNotEmpty() JWT_REFRESH_SECRET: string;

  @IsString() @IsNotEmpty() REDIS_HOST: string;
  @IsInt() REDIS_PORT: number;
  @IsString() @IsOptional() REDIS_PASSWORD?: string;

  @IsString() @IsNotEmpty() IMAGEKIT_PUBLIC_KEY: string;
  @IsString() @IsNotEmpty() IMAGEKIT_PRIVATE_KEY: string;
  @IsString() @IsNotEmpty() IMAGEKIT_URL_ENDPOINT: string;

  @IsString() @IsOptional() RESEND_API_KEY?: string;

  @IsString() @IsOptional() MAIL_HOST?: string;
  @IsInt() @IsOptional() MAIL_PORT?: number;
  @IsString() @IsOptional() MAIL_USER?: string;
  @IsString() @IsOptional() MAIL_PASSWORD?: string;
  @IsString() @IsNotEmpty() MAIL_FROM: string;

  // Google Drive Backup (optional — backup cron skips gracefully if not set)
  @IsString() @IsOptional() GOOGLE_DRIVE_FOLDER_ID?: string;
  @IsString() @IsOptional() GOOGLE_DRIVE_CLIENT_ID?: string;
  @IsString() @IsOptional() GOOGLE_DRIVE_CLIENT_SECRET?: string;
  @IsString() @IsOptional() GOOGLE_DRIVE_REFRESH_TOKEN?: string;
  @IsString() @IsOptional() GOOGLE_SERVICE_ACCOUNT_KEY_BASE64?: string;
  @IsString() @IsOptional() BACKUP_CRON?: string;
  @IsInt() @IsOptional() BACKUP_RETAIN_COUNT?: number;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.toString()}`);
  }
  return validated;
}
