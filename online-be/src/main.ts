import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 8000;

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');
}
void bootstrap();