import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // The frontend is served from a different origin during development.
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
