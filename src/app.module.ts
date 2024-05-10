import { Module } from '@nestjs/common';
import { TypeormModule } from '@src/typeorm/typeorm.module';

import { UserModule } from '@src/entities/user/user.module';
import { TagModule } from '@src/entities/tag/tag.module';
import { CompanyModule } from '@src/entities/company/company.module';
import { PaymentModule } from '@src/entities/payment/payment.module';
import { TaskModule } from '@src/entities/task/task.module';
import { LocationModule } from './entities/location/location.module';
import { CompleteTaskModule } from './entities/complete-task/complete-task.module';
import { ReportTaskModule } from './entities/report-task/report-task.module';
import { AuthModule } from './auth/auth.module';
import { SeedsModule } from './seeds/seeds.module';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { HelperModule } from './helper/helper.module';
import { PasswordModule } from './password/password.module';
import { TwilioModule } from './twilio/twilio.module';
import {AwsConfigModule} from "@src/aws/config/aws.config.module";
import {S3Module} from "@src/aws/s3/s3.module";
import { CheckerModule } from './checker/checker.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
