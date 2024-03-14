import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {User} from "@src/entities/user/user.entity";


@Entity({ schema: 'public', name: 'Payment' })
export class Payment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  cardType: string;

  @Column({ type: 'varchar' })
  customerId: string;

  @Column({ type: 'varchar' })
  expiration: string;

  @Column({ type: 'varchar' })
  nameOnCard: string;

  @Column({ type: 'varchar' })
  number: string;

  @Column({ type: 'varchar' })
  prefer: string;

  @Column({ type: 'varchar' })
  subscriberId: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'boolean' })
  agree: boolean;

  @ManyToOne(() => User, user => user.payments)
  user: User;
}
