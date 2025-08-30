import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function generateSchema() {
    // Create the Nest application context (no HTTP server)
    const app = await NestFactory.createApplicationContext(AppModule);

    console.log('✅ GraphQL schema generated successfully!');

    // Close the app
    await app.close();
}

generateSchema().catch((err) => {
    console.error('❌ Error generating GraphQL schema:', err);
    process.exit(1);
});
