import { Module } from '@nestjs/common';
import {TypeormModule} from "@src/typeorm/typeorm.module";

import {UserModule} from "@src/entities/user/user.module";
import {TagModule} from "@src/entities/tag/tag.module";
import {CompanyModule} from "@src/entities/company/company.module";
import {PaymentModule} from "@src/entities/payment/payment.module";
import {TaskModule} from "@src/entities/task/task.module";
import { LocationModule } from './entities/location/location.module';
import { CompleteTaskModule } from './entities/complete-task/complete-task.module';
import { ReportTaskModule } from './entities/report-task/report-task.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { SeedsModule } from './seeds/seeds.module';
import {ConfigModule} from "@nestjs/config";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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
    AccountModule,
    AuthModule,
    SeedsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
