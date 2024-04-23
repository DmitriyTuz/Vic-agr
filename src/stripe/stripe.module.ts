import { Module } from '@nestjs/common';
import {StripeService} from "@src/stripe/stripe.service";


@Module({
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
