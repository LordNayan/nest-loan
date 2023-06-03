import { Test, TestingModule } from '@nestjs/testing';
import { LoanHelper } from '@loan/loan.helper';
import { Loan } from '@src/database/entities/loan.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repayment } from '@database/entities/repayment.entity';
import { RepaymentStatus } from '@common/enums/loan.enum';
import { LoanDataMock, RepaymentMockArray } from './mockData/loan.mockData';

describe('LoanHelper', () => {
  let loanHelper: LoanHelper;
  let loanRepository: Repository<Loan>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanHelper,
        {
          provide: 'LoanRepository',
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    loanHelper = module.get<LoanHelper>(LoanHelper);
    loanRepository = module.get<Repository<Loan>>(getRepositoryToken(Loan));
  });

  describe('generateRepayments', () => {
    it('should generate repayments correctly', () => {
      const amount = 1000;
      const term = 3;

      const repayments = loanHelper.generateRepayments(amount, term);

      expect(repayments).toHaveLength(term);
      expect(repayments[0].amount).toBe(+(amount / term).toFixed(2));
    });
  });

  describe('createReturnValue', () => {
    it('should create the return value correctly', () => {
      const repayments: Repayment[] = RepaymentMockArray;
      const returnValue = loanHelper.createReturnValue(repayments);

      expect(returnValue).toHaveProperty('loan');
      expect(returnValue.loan).toHaveProperty('repayments');
      expect(returnValue.loan.repayments).toHaveLength(repayments.length);
    });
  });

  describe('isLoanPaid', () => {
    it('should return true if all repayments are paid', async () => {
      jest
        .spyOn(loanRepository, 'findOneOrFail')
        .mockResolvedValue(LoanDataMock);

      const result = await loanHelper.isLoanPaid(LoanDataMock);

      expect(result).toBe(true);
    });

    it('should return false if there are pending repayments', async () => {
      const pendingLoanData = { ...LoanDataMock };
      const repaymentArray = RepaymentMockArray;
      repaymentArray[0].status = RepaymentStatus.Pending;
      pendingLoanData.repayments = repaymentArray;
      jest
        .spyOn(loanRepository, 'findOneOrFail')
        .mockResolvedValue(pendingLoanData);

      const result = await loanHelper.isLoanPaid(pendingLoanData);

      expect(result).toBe(false);
    });
  });
});
