import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as process from "node:process";
import { existsSync, mkdirSync } from 'fs';
import {join} from "path";
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://192.168.50.112:3001', 'http://ptdocs.glitchweb.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (!existsSync('./uploads/days')) {
    mkdirSync('./uploads/days', { recursive: true });
  }

  if (!existsSync('./uploads/tags')) {
    mkdirSync('./uploads/tags', { recursive: true });
  }

  if (!existsSync('./uploads/docs')) {
    mkdirSync('./uploads/docs', { recursive: true });
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT || 3000);

  console.log(`PTdocs REST API server running on http://localhost:${process.env.PORT || 3000}`)
}
bootstrap();