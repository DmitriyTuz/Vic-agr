import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "@src/entities/user/user.entity";
import {Company} from "@src/entities/company/company.entity";

@Entity({ schema: 'public', name: 'Tag' })
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

}