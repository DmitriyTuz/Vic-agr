import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from '@src/entities/task/task.entity';
import { User } from '@src/entities/user/user.entity';
import {ApiProperty} from "@nestjs/swagger";

@Injectable()
@Entity({ schema: 'public', name: 'ReportTasks' })
export class ReportTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  comment: string;

  @Column({ type: 'jsonb', array: true, default: [] })
  mediaInfo: Record<string, any>[];

  @Column()
  userId: number;

  @Column()
  taskId: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2024-03-15T10:00:00.000Z', description: 'Timestamp when task was reported' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2024-03-15T12:00:00.000Z', description: 'Timestamp when reported task was updated' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reportInfo)
  user: User;

  @ManyToOne(() => Task, (task) => task.reportInfo)
  task: Task;
}
