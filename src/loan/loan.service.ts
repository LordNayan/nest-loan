import { Loan } from '@src/database/entities/loan.entity';
import {
  CreateLoanDto,
  CreateLoanResponseDto,
  RepaymentPaidResponse,
} from './loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repayment } from '@src/database/entities/repayment.entity';
import { User } from '@src/database/entities/user.entity';
import { ContextProvider } from '@common/services/http-context.service';
import { LoanHelper } from './loan.helper';
import { Errors } from '@common/enums/error.enum';
import { LoanStatus, RepaymentStatus } from '@common/enums/loan.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class LoanService {
  constructor(
    private contextProvider: ContextProvider,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Repayment)
    private readonly repaymentRepository: Repository<Repayment>,
    private readonly helper: LoanHelper,
  ) {}

  public async createLoan(
    payload: CreateLoanDto,
  ): Promise<CreateLoanResponseDto> {
    const loan: Loan = new Loan();
    const userId = this.contextProvider.get('userId') as number;

    const { amount, term } = payload;

    loan.amount = amount;
    loan.term = term;
    loan.user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const loanData = await this.loanRepository.save(loan);

    const repayments = this.helper.generateRepayments(amount, term);
    const repaymentsToSave = [];

    repayments.forEach((partPayment) => {
      const repayment: Repayment = new Repayment();
      repayment.amount = partPayment.amount;
      repayment.dueDate = partPayment.date;
      repayment.loan = loanData;
      repaymentsToSave.push(repayment);
    });
    const repaymentData = await Promise.all([
      ...repaymentsToSave.map((rp) => this.repaymentRepository.save(rp)),
    ]);
    return this.helper.createReturnValue(repaymentData);
  }

  public async approveLoan(loanId: string): Promise<Loan> {
    const loanData = await this.loanRepository.findOne({
      where: {
        id: loanId,
      },
    });
    if (!loanData) throw new BadRequestException(Errors.LOAN_NOT_FOUND);
    if (
      loanData.status === LoanStatus.Approved ||
      loanData.status === LoanStatus.Paid
    )
      throw new BadRequestException(Errors.INVALID_ID);

    loanData.status = LoanStatus.Approved;
    return this.loanRepository.save(loanData);
  }

  public async getLoans(): Promise<User> {
    try {
      const userData = await this.userRepository.findOneOrFail({
        where: {
          id: this.contextProvider.get('userId') as number,
        },
        relations: ['loans'],
      });
      return userData;
    } catch (error) {
      throw new NotFoundException(Errors.USER_NOT_FOUND);
    }
  }

  public async getLoanById(loanId: string): Promise<Loan> {
    try {
      const loanData = await this.loanRepository.findOneOrFail({
        where: {
          id: loanId,
          user: this.contextProvider.get('userId') as number,
        },
        relations: ['repayments'],
      });
      return loanData;
    } catch (error) {
      throw new NotFoundException(Errors.LOAN_NOT_FOUND);
    }
  }

  public async payInstallment(
    repaymentId: string,
  ): Promise<RepaymentPaidResponse> {
    const repayment = await this.repaymentRepository.findOne({
      where: {
        id: repaymentId,
      },
      relations: ['loan'],
    });
    if (!repayment || repayment.status === RepaymentStatus.Paid)
      throw new BadRequestException(Errors.INVALID_ID);

    if (repayment.loan.status === LoanStatus.Pending)
      throw new BadRequestException(Errors.LOAN_NOT_APPROVED);

    repayment.status = RepaymentStatus.Paid;
    await this.repaymentRepository.save(repayment);

    const loanPaid = await this.helper.isLoanPaid(repayment.loan);
    if (loanPaid) repayment.loan.status = LoanStatus.Paid;
    return { repayment };
  }
}
