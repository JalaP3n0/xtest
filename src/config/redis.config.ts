import { Redis } from 'ioredis';

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
};

export const createRedisClient = () => {
  return new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  });
};
