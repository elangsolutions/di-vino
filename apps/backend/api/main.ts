// backend/api/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverless from 'serverless-http';

let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverless(expressApp);
  }

  return cachedServer;
}

export default async function handler(req, res) {
  res.status(200).send("Hello World");
  // const server = await bootstrap();
  // return server(req, res);
}