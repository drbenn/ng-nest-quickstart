import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api-v1');
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL
    ],
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    // allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
