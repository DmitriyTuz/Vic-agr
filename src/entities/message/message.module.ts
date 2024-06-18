import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import {MessageProducerService} from "@src/entities/message/message.producer.service";
import {MessageConsumer} from "@src/entities/message/message.consumer";
import {BullModule} from "@nestjs/bull";

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageProducerService, MessageConsumer],
  imports: [
    BullModule.registerQueue({
      name: 'message-queue'
    }),
  ]
})
export class MessageModule {}
