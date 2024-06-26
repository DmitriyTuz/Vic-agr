import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Tag } from '@src/entities/tag/tag.entity';
import { Company } from '@src/entities/company/company.entity';
import { Payment } from '@src/entities/payment/payment.entity';
import { Task } from '@src/entities/task/task.entity';
import { CompleteTask } from '@src/entities/complete-task/complete-task.entity';
import { ReportTask } from '@src/entities/report-task/report-task.entity';

@Entity({ schema: 'public', name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '10001', description: 'User unique id' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Alex', description: 'User name' })
  name: string;

  @Column()
  @ApiProperty({ example: '12345678', description: 'User password' })
  password: string;

  @Column()
  @ApiProperty({ example: '+100000000001', description: 'User phone' })
  phone: string;

  @Column()
  @ApiProperty({ example: 'WORKER', description: 'User role' })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActive: Date;

  @Column({ default: false })
  hasOnboard: boolean;

  @CreateDateColumn()
  @ApiProperty({ example: '2024-03-15T10:00:00.000Z', description: 'Timestamp when user was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2024-03-15T12:00:00.000Z', description: 'Timestamp when user was last updated' })
  updatedAt: Date;

  @Column()
  companyId: number;

  @ManyToMany(() => Tag, (tag) => tag.users)
  @JoinTable({
    name: 'UserTags',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Task, (task) => task.creator)
  createdTasks: Task[];

  @ManyToMany(() => Task, (task) => task.workers)
  @JoinTable({
    name: 'UserTasks',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'taskId',
      referencedColumnName: 'id',
    },
  })
  tasks: Task[];

  @OneToMany(() => CompleteTask, (completeTask) => completeTask.user)
  @JoinColumn({ name: 'userId' })
  completeInfo: CompleteTask[];

  @OneToMany(() => ReportTask, (reportTask) => reportTask.user)
  reportInfo: ReportTask[];
}
