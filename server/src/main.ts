import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  });
  app.use(compression());
  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
