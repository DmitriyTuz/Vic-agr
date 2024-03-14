import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "@src/entities/users/users.entity";
import {Company} from "@src/entities/companies/companies.entity";

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