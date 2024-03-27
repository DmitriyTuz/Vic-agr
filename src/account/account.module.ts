import { Module } from '@nestjs/common';
import { AccountService } from '@src/account/account.service';
import { AccountController } from '@src/account/account.controller';
import { UserModule } from '@src/entities/user/user.module';
import { PaymentModule } from '@src/entities/payment/payment.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [UserModule, PaymentModule],
  exports: [AccountService],
})
export class AccountModule {}
