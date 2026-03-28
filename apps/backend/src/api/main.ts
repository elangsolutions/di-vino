import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import serverless from 'serverless-http';

let cachedServer;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  return app;
}

if (!process.env.VERCEL) {
  async function bootstrap() {
    const app = await createApp();
    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
}

async function bootstrapServerless() {
  if (!cachedServer) {
    const app = await createApp();
    await app.init(); // ❗ no listen

    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverless(expressApp);
  }
  return cachedServer;
}

export default async function handler(req, res) {
  const server = await bootstrapServerless();
  return server(req, res);
}