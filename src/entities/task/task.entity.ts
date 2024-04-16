import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { TaskStatuses } from '@lib/constants';

import { Company } from '@src/entities/company/company.entity';
import { User } from '@src/entities/user/user.entity';
import { Tag } from '@src/entities/tag/tag.entity';
import { MapLocation } from '@src/entities/location/location.entity';
import { CompleteTask } from '@src/entities/complete-task/complete-task.entity';
import { ReportTask } from '@src/entities/report-task/report-task.entity';

@Entity({ schema: 'public', name: 'Tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'Task unique id' })
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  companyId: number;

  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'Task 1', description: 'Task title' })
  title: string;

  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'Low, Medium or High', description: 'Task type' })
  type: string;

  @Column({ type: 'integer' })
  @ApiProperty({ example: '1', description: 'Task execution time' })
  executionTime: number;

  @Column({ type: 'text' })
  @ApiProperty({ example: 'Any comment', description: 'Task comment' })
  comment: string;

  @Column({ type: 'jsonb', default: [] })
  @ApiProperty({ example: '[{id:1, name: 1.jpg}, {id:2, name: 2.jpg}]', description: 'Task media info' })
  mediaInfo: Record<string, any>[];

  @Column({ type: 'jsonb', default: [] })
  @ApiProperty({ example: '[{id:1, name: 1.txt}, {id:2, name: 2.txt}]', description: 'Task documents info' })
  documentsInfo: Record<string, any>[];

  @Column({ type: 'varchar', default: TaskStatuses.ACTIVE })
  @ApiProperty({ example: 'Active, Waiting or Completed', description: 'Task status' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ example: 'Date when the task was completed', description: 'Task completed date' })
  completedAt: Date;

  @CreateDateColumn()
  @ApiProperty({ example: '2024-03-15T10:00:00.000Z', description: 'Timestamp when user was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2024-03-15T12:00:00.000Z', description: 'Timestamp when user was last updated' })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ example: 'Due date of the task', description: 'Task due date' })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.createdTasks)
  @ApiProperty({ example: '1', description: 'ID of the user who created the task' })
  @JoinColumn({ name: 'userId' })
  creator: User;

  @ManyToMany(() => User, (user) => user.tasks)
  @ApiProperty({ type: () => User, isArray: true, description: 'Users assigned to the task' })
  workers: User[];

  @ManyToOne(() => Company, (company) => company.tasks)
  @ApiProperty({ example: '1', description: 'ID of the company that owns the task' })
  company: Company;

  @ManyToMany(() => Tag)
  // @ManyToMany(() => Tag, (tag) => tag.tasks)
  @ApiProperty({ type: () => Tag, isArray: true, description: 'Tags associated with the task' })
  @JoinTable({
    name: 'TaskTags',
    joinColumn: {
      name: 'taskId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @ManyToMany(() => MapLocation, (location) => location.tasks)
  @ApiProperty({ type: () => MapLocation, isArray: true, description: 'Map locations associated with the task' })
  mapLocation: MapLocation[];

  @OneToMany(() => CompleteTask, (completeTask) => completeTask.task)
  @ApiProperty({ type: () => CompleteTask, isArray: true, description: 'Complete task information' })
  completeInfo: CompleteTask[];

  @OneToMany(() => ReportTask, (reportTask) => reportTask.task)
  @ApiProperty({ type: () => ReportTask, isArray: true, description: 'Report task information' })
  reportInfo: ReportTask[];
}
