import { Module } from '@nestjs/common';
import {TwilioService} from "@src/twilio/twilio.service";


@Module({
  providers: [TwilioService],
  exports: [TwilioService]
})
export class TwilioModule {}
