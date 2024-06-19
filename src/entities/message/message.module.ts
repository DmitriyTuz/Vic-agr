import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import {MessageProducerService} from "@src/entities/message/message.producer.service";
import {MessageConsumer} from "@src/entities/message/message.consumer";
import {BullModule} from "@nestjs/bull";
import {QueueModule} from "@src/queue/queue.module";

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageProducerService, MessageConsumer],
  imports: [
    QueueModule
  ]
})
export class MessageModule {}
