import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001'),
  corsOrigins: process.env.CORS_ORIGINS?.split(',') ?? [],
}));
