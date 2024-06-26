import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {User} from "@src/entities/user/user.entity";
import {Tag} from "@src/entities/tag/tag.entity";
import { Task } from '@src/entities/task/task.entity';
import { MapLocation } from '@src/entities/location/location.entity';


@Entity({ schema: 'public', name: 'Companies' })
export class Company {
  @ApiProperty({ example: '1', description: 'Company unique id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '1', description: 'owner id' })
  @Column()
  ownerId: number;

  @ApiProperty({ example: 'some.jgp', description: 'owner logo' })
  @Column({ type: 'json' })
  logo: Record<string, any>;

  @ApiProperty({ example: 'DDD', description: 'Company name' })
  @Column()
  name: string;

  @ApiProperty({ example: true, description: 'Does the company have a subscription ?' })
  @Column({ default: false })
  isSubscribe: boolean;

  @ApiProperty({ example: true, description: 'Does the company have a trial ?' })
  @Column({ default: false })
  isTrial: boolean;

  @ApiProperty({ example: true, description: 'The company already had trial' })
  @Column({ default: false })
  hasTrial: boolean;

  @ApiProperty({ example: '2024-02-14T00:00:00.000Z', description: 'Trial date' })
  @Column({ type: 'timestamp', nullable: true })
  trialAt: Date;

  @CreateDateColumn()
  @ApiProperty({ example: '2024-03-15T10:00:00.000Z', description: 'Timestamp when company was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2024-03-15T12:00:00.000Z', description: 'Timestamp when company was last updated' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Tag, (tag) => tag.company)
  tags: Tag[];

  @OneToMany(() => MapLocation, (location) => location.company)
  locations: MapLocation[];

  @OneToMany(() => Task, (task) => task.company)
  tasks: Task[];
}
