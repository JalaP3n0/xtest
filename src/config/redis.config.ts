import { Redis } from 'ioredis';

export const createRedisClient = () => {
  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    return new Redis(redisUrl, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });
  }

  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3,
  });
};
