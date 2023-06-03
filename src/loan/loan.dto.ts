import { LoanStatus, RepaymentStatus } from '@common/enums/loan.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Repayment } from '@src/database/entities/repayment.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    description: 'Amount required',
    example: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The term of loan.',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  term: number;
}

export class CreateLoanResponseDto {
  loan: LoanData;
}

class LoanData {
  id: string;
  term: number;
  amount: number;
  status: LoanStatus;
  repayments: RepaymentData[];
}

class RepaymentData {
  amount: number;
  dueDate: Date;
  status: RepaymentStatus;
}

export class RepaymentPaidResponse {
  repayment: Repayment;
}
