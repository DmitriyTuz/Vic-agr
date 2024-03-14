import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {Task} from "@src/entities/task/task.entity";
import {User} from "@src/entities/user/user.entity";

@Injectable()
@Entity({ schema: 'public', name: 'Report-task' })
export class ReportTask {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  comment: string;

  @Column({ type: 'jsonb', array: true, default: [] })
  mediaInfo: Record<string, any>[];

  @ManyToOne(() => User, user => user.reportInfo)
  user: User;

  @ManyToOne(() => Task, task => task.reportInfo)
  task: Task;

}
