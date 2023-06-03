import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Loan } from './loan.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  public userName: string;

  @Column({ type: 'varchar', length: 250 })
  public password: string;

  @Column({ type: 'boolean', default: false })
  public isAdmin: boolean;

  @OneToMany(() => Loan, (loan) => loan.user)
  public loans: Loan[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;
}
