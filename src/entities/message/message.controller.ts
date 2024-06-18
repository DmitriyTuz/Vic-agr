import {Controller, Get, Query} from '@nestjs/common';
import {MessageService} from "@src/entities/message/message.service";
import {MessageProducerService} from "@src/entities/message/message.producer.service";

@Controller('message')
export class MessageController {

  constructor(private readonly messageService: MessageService,
              private messageProducerService: MessageProducerService) {}

  @Get('send-message')
  async sendMessage(@Query('msg') msg: string) {
    this.messageProducerService.sendMessage(msg);
    return msg;
  }
}
