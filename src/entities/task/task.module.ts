import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from '@src/entities/task/task.service';
import { TaskController } from '@src/entities/task/task.controller';
import { UserModule } from '@src/entities/user/user.module';
import { Task } from '@src/entities/task/task.entity';
import { User } from '@src/entities/user/user.entity';
import {HelperModule} from "@src/helper/helper.module";

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeOrmModule.forFeature([Task, User]), UserModule, HelperModule],
  exports: [TaskService],
})
export class TaskModule {}
