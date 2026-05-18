import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createRedisClient } from '../config/redis.config';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  async connectToRedis(): Promise<boolean> {
    try {
      const pubClient = createRedisClient();
      const subClient = pubClient.duplicate();

      const connectionTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
      );

      await Promise.race([
        Promise.all([
          new Promise((resolve) => pubClient.once('ready', resolve)),
          new Promise((resolve) => subClient.once('ready', resolve)),
        ]),
        connectionTimeout,
      ]);

      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.logger.log('Redis IO Adapter initialized successfully.');
      return true;
    } catch (error) {
      this.logger.warn(`Redis connection failed: ${error.message}. Falling back to default IO adapter.`);
      return false;
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    return server;
  }
}
