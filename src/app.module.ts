import { Module } from '@nestjs/common';
import { TypeormModule } from '@src/typeorm/typeorm.module';

import { UserModule } from '@src/entities/user/user.module';
import { TagModule } from '@src/entities/tag/tag.module';
import { CompanyModule } from '@src/entities/company/company.module';
import { PaymentModule } from '@src/entities/payment/payment.module';
import { TaskModule } from '@src/entities/task/task.module';
import {LocationModule} from "@src/entities/location/location.module";
import {AuthModule} from "@src/auth/auth.module";
import {SeedsModule} from "@src/seeds/seeds.module";
import {ReportTaskModule} from "@src/entities/report-task/report-task.module";
import {CompleteTaskModule} from "@src/entities/complete-task/complete-task.module";
import { ConfigModule } from '@nestjs/config';
import {StripeModule} from "@src/stripe/stripe.module";
import {HelperModule} from "@src/helper/helper.module";
import {PasswordModule} from "@src/password/password.module";
import {TwilioModule} from "@src/twilio/twilio.module";
import {AwsConfigModule} from "@src/aws/config/aws.config.module";
import {S3Module} from "@src/aws/s3/s3.module";
import {MailModule} from "@src/mail/mail.module";
import {CheckerModule} from "@src/checker/checker.module";
import {BullModule} from "@nestjs/bull";
import { MessageModule } from './entities/message/message.module';
import { QueueModule } from './queue/queue.module';
import {RedisCacheModule} from "@src/redis/redis.cache/redis.cache.module";
import {NestCacheModule} from "@src/cache/cache.module";
import {ElasticSearchModule} from "@src/elastic-search/elastic-search.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    // BullModule.registerQueue({
    //   name: 'message-queue'
    // }),
    TypeormModule,
    UserModule,
    TagModule,
    CompanyModule,
    PaymentModule,
    TaskModule,
    LocationModule,
    CompleteTaskModule,
    ReportTaskModule,
    AuthModule,
    SeedsModule,
    StripeModule,
    HelperModule,
    PasswordModule,
    TwilioModule,
    AwsConfigModule,
    S3Module,
    CheckerModule,
    MailModule,
    MessageModule,
    QueueModule,
    RedisCacheModule,
    NestCacheModule,
    // ElasticSearchModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
