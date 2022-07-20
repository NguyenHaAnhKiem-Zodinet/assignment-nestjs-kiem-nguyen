import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config Swagger
  const options = new DocumentBuilder()
    .setTitle('API Zodinet - AnhKiem')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // ConfigService
  const config = app.get(ConfigService);

  // Config Class-Validator
  app.useGlobalPipes(new ValidationPipe());

  // Server Listen
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();
