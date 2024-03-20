import { Module } from '@nestjs/common';
import { ReportTaskController } from './report-task.controller';
import { ReportTaskService } from './report-task.service';

@Module({
  controllers: [ReportTaskController],
  providers: [ReportTaskService],
})
export class ReportTaskModule {}
