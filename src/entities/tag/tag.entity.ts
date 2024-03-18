import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinTable} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "@src/entities/user/user.entity";
import {Company} from "@src/entities/company/company.entity";
import {Task} from "@src/entities/task/task.entity";

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

  @ManyToOne(() => Company, (company) => company.tags)
  company: Company;

  @ManyToMany(() => Task, task => task.tags)
  @JoinTable({
    name: 'TaskTags',
    joinColumn: {
      name: 'taskId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id'
    }
  })
  tasks: Task[];

}