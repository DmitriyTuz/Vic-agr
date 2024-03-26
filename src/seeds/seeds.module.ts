import { Module } from '@nestjs/common';

import { SeedsService } from '@src/seeds/seeds.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@src/entities/user/user.module';
import { TagModule } from '@src/entities/tag/tag.module';
import { TaskModule } from '@src/entities/task/task.module';

import { Company } from '@src/entities/company/company.entity';
import { User } from '@src/entities/user/user.entity';
import { Tag } from '@src/entities/tag/tag.entity';
import { Task } from '@src/entities/task/task.entity';

@Module({
  providers: [SeedsService],
  imports: [TypeOrmModule.forFeature([Company, User, Tag, Task]), UserModule, TagModule, TaskModule],
})
export class SeedsModule {}
