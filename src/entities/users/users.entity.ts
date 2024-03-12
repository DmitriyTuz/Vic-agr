import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";

@Entity({ schema: 'public', name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({example: '1', description: 'User unique id'})
  id: number;

  @Column()
  @ApiProperty({example: 'Alex', description: "User name"})
  name: string;

  @Column()
  @ApiProperty({example: '12345678', description: "User password"})
  password: string;

  @Column()
  @ApiProperty({example: '+100000000001', description: "User phone"})
  phone: string;

  @Column()
  @ApiProperty({example: 'WORKER', description: "User role"})
  type: string;

  // @Column()
  // companyId: number;
}
