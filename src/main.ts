import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function start() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();
  await app.listen(5000, () => logger.log(`Application starting ...`));
}
start();
