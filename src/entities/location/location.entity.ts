import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Company } from '@src/entities/company/company.entity';
import { Task } from '@src/entities/task/task.entity';

@Entity({ schema: 'public', name: 'MapLocations' })
export class MapLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal' })
  lat: number;

  @Column({ type: 'decimal' })
  lng: number;

  @Column({ nullable: true })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.locations)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToMany(() => Task, (task) => task.mapLocation)
  @JoinTable({
    name: 'TaskLocations',
    joinColumn: {
      name: 'locationId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'taskId',
      referencedColumnName: 'id',
    },
  })
  tasks: Task[];
}
