import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // do not need to determineEnvFile path as envFilePath is passed to ConfigModule.forRoot() in AppModule.
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000;
  app.use(cookieParser());
  app.setGlobalPrefix('api-v1');
  // app.enableCors(),
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL
    ],
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    // allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(port ?? 3000);

  
  
}
bootstrap();


