import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './chat/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.setGlobalPrefix('api');
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`NestJS application is running on port: ${port}`);
}
bootstrap();
