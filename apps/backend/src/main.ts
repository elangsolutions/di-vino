import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //const frontendUrls = (process.env.FRONTEND_URLS || 'http://localhost:5173')
    //    .split('|')
     //   .map(url => url.trim());

    app.enableCors({
        origin: '*',
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();