import { plainToInstance } from 'class-transformer';
import {
    IsEnum, IsInt, IsNotEmpty,
    IsString, validateSync,
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