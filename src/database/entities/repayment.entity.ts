import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Loan } from '@database/entities/loan.entity';
import { RepaymentStatus } from '@common/enums/loan.enum';

@Entity()
export class Repayment {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  public dueDate!: Date;

  @Column({
    type: 'enum',
    enum: RepaymentStatus,
    default: RepaymentStatus.Pending,
  })
  public status: string;

  @ManyToOne(() => Loan, (loan) => loan.id)
  public loan: Loan;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
