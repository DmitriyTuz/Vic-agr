import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from '@src/entities/task/task.entity';
import { User } from '@src/entities/user/user.entity';

@Injectable()
@Entity({ schema: 'public', name: 'CompleteTasks' })
export class CompleteTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  comment: string;

  @Column({ type: 'varchar' })
  timeLog: string;

  @Column({ type: 'jsonb', array: true, default: [] })
  mediaInfo: Record<string, any>[];

  @Column()
  userId: number;

  @Column()
  taskId: number;

  @ManyToOne(() => User, (user) => user.completeInfo)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Task, (task) => task.completeInfo)
  task: Task;
}
