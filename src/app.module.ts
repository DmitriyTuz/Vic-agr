import { Module } from '@nestjs/common';
import {TypeormModule} from "@src/typeorm/typeorm.module";

import {UserModule} from "@src/entities/user/user.module";
import {TagModule} from "@src/entities/tag/tag.module";
import {CompanyModule} from "@src/entities/company/company.module";
import { PaymentModule } from './entities/payment/payment.module';


@Module({
  imports: [
    TypeormModule,
    UserModule,
    TagModule,
    CompanyModule,
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
