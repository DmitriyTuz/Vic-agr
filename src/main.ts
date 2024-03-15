import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {AppModule} from "@src/app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {SeedsService} from "@src/seeds/seeds.service";

async function start() {
  const app = await NestFactory.create(AppModule);

  const seedsService = app.get(SeedsService);
  await seedsService.seedData();
  await app.close();

  const config = new DocumentBuilder()
      .setTitle("Vic_agr")
      .setDescription("Documentation REST API")
      .setVersion("0.0.1")
      .addTag("D_TUZ")
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          'JWT')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  const logger = new Logger();
  await app.listen(5000, () => logger.log(`Application starting ...`));
}
start();
