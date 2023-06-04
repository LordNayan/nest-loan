import { CreateLoanResponseDto } from '@loan/dto/loan.dto';
import { Repayment } from '@src/database/entities/repayment.entity';
import { LoanStatus, RepaymentStatus } from '@common/enums/loan.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from '@src/database/entities/loan.entity';
import { Repository } from 'typeorm';

export class LoanHelper {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
  ) {}
  public generateRepayments(amount, term) {
    const repayments = [];

    const currentDate = new Date();
    let remainingAmount = amount;
    const repaymentAmount = (remainingAmount / term).toFixed(2);

    while (remainingAmount != 0) {
      if (remainingAmount < 1) {
        repayments.pop();
        currentDate.setDate(currentDate.getDate() - 7);
        repayments.push({
          date: currentDate.toISOString().replace('T', ' ').slice(0, -1),
          amount: +(+repaymentAmount + remainingAmount).toFixed(2),
        });
        break;
      } else {
        repayments.push({
          date: currentDate.toISOString().replace('T', ' ').slice(0, -1),
          amount: +repaymentAmount,
        });
      }
      remainingAmount -= +repaymentAmount;
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return repayments;
  }

  public createReturnValue(repayments: Repayment[]): CreateLoanResponseDto {
    const response = {};
    response['loan'] = {};
    response['loan'].id = repayments[0].loan.id;
    response['loan'].amount = repayments[0].loan.amount;
    response['loan'].term = repayments[0].loan.term;
    response['loan'].status = repayments[0].loan.status as LoanStatus;
    response['loan'].repayments = repayments.map((rp) => {
      return {
        amount: rp.amount,
        dueDate: rp.dueDate,
        status: rp.status as RepaymentStatus,
      };
    });
    return response as CreateLoanResponseDto;
  }

  public async isLoanPaid(loan: Loan): Promise<boolean> {
    const loanData = await this.loanRepository.findOneOrFail({
      where: {
        id: loan.id,
      },
      relations: ['repayments'],
    });
    const pendingRepayments = loanData.repayments.find(
      (rp) => rp.status === RepaymentStatus.Pending,
    );

    if (pendingRepayments) {
      return false;
    }
    loanData.status = LoanStatus.Paid;

    await this.loanRepository.save(loanData);
    return true;
  }
}
