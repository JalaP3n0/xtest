import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './chat/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const redisIoAdapter = new RedisIoAdapter(app);
  const redisConnected = await redisIoAdapter.connectToRedis();
  if (redisConnected) {
    app.useWebSocketAdapter(redisIoAdapter);
  }

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true, // Allow any origin to resolve Vercel preview URL issues
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 200,
  });
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS application is running on port: ${port}`);
}
bootstrap();
