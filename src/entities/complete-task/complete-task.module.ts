import { Module } from '@nestjs/common';
import { CompleteTaskController } from './complete-task.controller';
import { CompleteTaskService } from './complete-task.service';

@Module({
  controllers: [CompleteTaskController],
  providers: [CompleteTaskService]
})
export class CompleteTaskModule {}
