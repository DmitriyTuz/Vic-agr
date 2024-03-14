import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {UserModule} from "@src/entities/user/user.module";
import {PaymentModule} from "@src/entities/payment/payment.module";

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [
    UserModule,
    PaymentModule
  ],
  exports: [AccountService]
})
export class AccountModule {}
