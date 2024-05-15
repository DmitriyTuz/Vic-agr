import { Module } from '@nestjs/common';
import {CompleteTaskController} from "@src/entities/complete-task/complete-task.controller";
import {CompleteTaskService} from "@src/entities/complete-task/complete-task.service";


@Module({
  controllers: [CompleteTaskController],
  providers: [CompleteTaskService],
})
export class CompleteTaskModule {}
