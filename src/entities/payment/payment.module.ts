import { Module } from '@nestjs/common';
import {PaymentController} from "@src/entities/payment/payment.controller";
import {PaymentService} from "@src/entities/payment/payment.service";


@Module({
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
