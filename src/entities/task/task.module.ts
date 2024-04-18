import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from '@src/entities/task/task.service';
import { TaskController } from '@src/entities/task/task.controller';
import { UserModule } from '@src/entities/user/user.module';
import { Task } from '@src/entities/task/task.entity';
import { User } from '@src/entities/user/user.entity';
import {HelperModule} from "@src/helper/helper.module";
import {TagModule} from "@src/entities/tag/tag.module";
import {CompleteTask} from "@src/entities/complete-task/complete-task.entity";
import {ReportTask} from "@src/entities/report-task/report-task.entity";

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeOrmModule.forFeature([Task, User, CompleteTask, ReportTask]), UserModule, HelperModule, TagModule],
  exports: [TaskService],
})
export class TaskModule {}
