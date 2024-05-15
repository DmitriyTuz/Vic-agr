import { Module } from '@nestjs/common';
import {ReportTaskService} from "@src/entities/report-task/report-task.service";
import {ReportTaskController} from "@src/entities/report-task/report-task.controller";


@Module({
  controllers: [ReportTaskController],
  providers: [ReportTaskService],
})
export class ReportTaskModule {}
