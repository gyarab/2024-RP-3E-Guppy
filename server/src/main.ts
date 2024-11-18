import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  });
  app.use(compression()); // for enabling gzip compression
  app.use(cookieParser()); // for parsing cookies

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
