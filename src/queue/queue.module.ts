import { Module } from '@nestjs/common';
import {BullModule} from "@nestjs/bull";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message-queue'
    }, {
      name: 'user-queue'
    }),
  ],
  exports: [BullModule]
})
export class QueueModule {}
