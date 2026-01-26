/* eslint-disable @typescript-eslint/no-require-imports */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as crypto from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = crypto as any;
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = function () {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : require('crypto').randomBytes(16).toString('hex');
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
