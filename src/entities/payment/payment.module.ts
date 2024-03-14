import { Module } from '@nestjs/common';
import {PaymentController} from "@src/entities/payment/payment.controller";
import {PaymentService} from "@src/entities/payment/payment.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Payment} from "@src/entities/payment/payment.entity";


@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [TypeOrmModule.forFeature([Payment])],
  exports: [PaymentService]
})
export class PaymentModule {}
