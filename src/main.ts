import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedsService } from '@src/seeds/seeds.service';
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import {ConfigService} from "@nestjs/config";
import {AllExceptionsFilter} from "@src/exception-filters/exception-filter";

const configService = new ConfigService();

async function start() {

  const PORT = configService.get('PORT') || 5000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api/');

  // if (configService.get('NODE_ENV') !== 'test') {
  //   app.setGlobalPrefix('api/');
  // }

  const seedDataFlag = configService.get('SEED_DATA') === 'true';
  if (seedDataFlag) {
    const seedsService = app.get(SeedsService);
    await seedsService.seedData();
  }

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(passport.initialize());

  const jwtStrategy = app.get(JwtStrategy);
  passport.use(jwtStrategy);

  const config = new DocumentBuilder()
    .setTitle('Vic_agr')
    .setDescription('Documentation REST API')
    .setVersion('0.0.1')
    .addTag('D_TUZ')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  const logger = new Logger();
  await app.listen(PORT, () => logger.log(`Application starting ...`));
}
start();
