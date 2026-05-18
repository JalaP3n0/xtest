import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './chat/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'https://xtest-q32v-n13ohkvjy-m-eg-z-s-projects.vercel.app',
      'http://localhost:3000', // Allow local development
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS application is running on port: ${port}`);
}
bootstrap();
