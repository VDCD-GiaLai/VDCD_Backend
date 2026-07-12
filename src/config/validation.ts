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

  @IsString() @IsNotEmpty() MAIL_HOST: string;
  @IsInt() MAIL_PORT: number;
  @IsString() @IsNotEmpty() MAIL_USER: string;
  @IsString() @IsNotEmpty() MAIL_PASSWORD: string;
  @IsString() @IsNotEmpty() MAIL_FROM: string;
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
