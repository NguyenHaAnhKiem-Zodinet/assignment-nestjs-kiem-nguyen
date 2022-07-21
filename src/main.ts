import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { initSwagger } from './v1/infrastructure/configs/swaggeConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cors
  app.enableCors();

  // Config Swagger
  initSwagger(app);

  // ConfigService
  const config = app.get(ConfigService);
  const port = parseInt(config.get('PORT'), 10);

  // Config Class-Validator
  app.useGlobalPipes(new ValidationPipe());

  // Server Listen
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
