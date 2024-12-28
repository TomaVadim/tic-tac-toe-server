import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { TelegramAuthGuard } from './guards/telegram-auth.guard';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.${process.env.NODE_ENV}.env`,
});

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT || 8080;
  const ORIGIN = process.env.CORS_ORIGIN;

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({ origin: ORIGIN });

  app.useGlobalGuards(new TelegramAuthGuard());

  await app.listen(PORT, () =>
    console.log(`Application is running on: ${PORT} port`),
  );
}

bootstrap();
