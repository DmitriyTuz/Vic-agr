import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'public', name: 'Plans' })
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripeId: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  interval: string;

  @Column()
  active: string;
}
