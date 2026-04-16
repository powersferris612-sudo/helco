import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8000),
  redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  databaseUrl: process.env.DATABASE_URL ?? ''
};