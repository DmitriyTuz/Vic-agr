import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import {Company} from "@src/entities/company/company.entity";
import {Task} from "@src/entities/task/task.entity";


@Entity({ schema: 'public', name: 'MapLocation' })
export class MapLocation {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal' })
  lat: number;

  @Column({ type: 'decimal' })
  lng: number;

  @ManyToOne(() => Company, company => company.locations)
  company: Company;

  @ManyToMany(() => Task)
  @JoinTable({
    name: 'TaskLocations',
    joinColumn: {
      name: 'locationId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'taskId',
      referencedColumnName: 'id'
    }
  })
  tasks: Task[];
}
