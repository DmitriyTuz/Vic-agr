import { Injectable } from '@nestjs/common';

import {InjectRepository} from "@nestjs/typeorm";

import {Repository} from "typeorm";
import {Payment} from "@src/entities/payment/payment.entity";

@Injectable()
export class PaymentService {

  constructor(
      @InjectRepository(Payment)
      private paymentRepository: Repository<Payment>
  ) {}

  async getOnePayment(userId: number): Promise<Payment> {
    return this.paymentRepository.findOne({ where: {userId} });
  }
}
