import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '@database/entities/user.entity';
import { LoanStatus } from '@common/enums/loan.enum';
import { Repayment } from '@database/entities/repayment.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public amount: number;

  @Column({ type: 'smallint' })
  public term: number;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.Pending,
  })
  public status: string;

  @ManyToOne(() => User, (user) => user.id)
  public user: User;

  @OneToMany(() => Repayment, (repayment) => repayment.loan)
  public repayments: Repayment[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
