import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "@src/entities/users/users.entity";

@Entity({ schema: 'public', name: 'Tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  @ApiProperty({example: '1', description: 'Tag unique id'})
  id: number;

  @Column()
  @ApiProperty({example: 'WORKER', description: "Tag name"})
  name: string;

  @ManyToMany(() => User, user => user.tags)
  users: User[];

}