import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Tag} from "@src/entities/tags/tags.entity";
import {Company} from "@src/entities/companies/companies.entity";

@Entity({ schema: 'public', name: 'User' })
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

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'UserTags',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id'
    }
  })
  tags: Tag[];

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;
}
