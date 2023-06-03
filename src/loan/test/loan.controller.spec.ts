import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from '@loan/loan.controller';
import { LoanService } from '@loan/loan.service';
import {
  ApproveLoanResponseMock,
  CreateLoanMock,
  CreateLoanResponseMock,
  getLoansResponseMock,
  loanResponseMock,
  repaymentPaidResponseMock,
} from '@loan/test/mockData/loan.mockData';
import { LoanHelper } from '@loan/loan.helper';
import { Repository } from 'typeorm';
import { User } from '@database/entities/user.entity';
import { ContextProvider } from '@common/services/http-context.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repayment } from '@database/entities/repayment.entity';
import { Loan } from '@database/entities/loan.entity';
import { Response, response } from 'express';

describe('LoanController', () => {
  let loanController: LoanController;
  let loanService: LoanService;
  let userRepository: Repository<User>;
  let loanRepository: Repository<Loan>;
  let repaymentRepository: Repository<Repayment>;
  let loanHelper: LoanHelper;
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        LoanService,
        LoanHelper,
        ContextProvider,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Loan),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Repayment),
          useClass: Repository,
        },
      ],
    }).compile();

    loanController = module.get<LoanController>(LoanController);
    loanService = module.get<LoanService>(LoanService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    loanRepository = module.get<Repository<Loan>>(getRepositoryToken(Loan));
    repaymentRepository = module.get<Repository<Repayment>>(
      getRepositoryToken(Repayment),
    );
    loanHelper = module.get<LoanHelper>(LoanHelper);
  });

  describe('createLoan', () => {
    it('should create a new loan', async () => {
      jest
        .spyOn(loanService, 'createLoan')
        .mockResolvedValue(CreateLoanResponseMock);

      const result = await loanController.createLoan(CreateLoanMock);

      expect(loanService.createLoan).toHaveBeenCalledWith(CreateLoanMock);
      expect(result).toEqual(CreateLoanResponseMock);
    });
  });

  describe('approveLoan', () => {
    it('should approve a loan', async () => {
      const loanId = '219e9770-7cad-4e73-9b50-9c3501d856ec';

      jest
        .spyOn(loanService, 'approveLoan')
        .mockResolvedValue(ApproveLoanResponseMock);

      const result = await loanController.approveLoan(loanId, res);

      expect(loanService.approveLoan).toHaveBeenCalledWith(loanId);
      expect(result).toEqual(ApproveLoanResponseMock);
    });
  });

  describe('getLoans', () => {
    it('should get all loans', async () => {
      jest
        .spyOn(loanService, 'getLoans')
        .mockResolvedValue(getLoansResponseMock);

      const result = await loanController.getLoans();

      expect(loanService.getLoans).toHaveBeenCalled();
      expect(result).toEqual(getLoansResponseMock);
    });
  });

  describe('getLoanById', () => {
    it('should get a single loan by ID', async () => {
      const loanId = '219e9770-7cad-4e73-9b50-9c3501d856ec';

      jest
        .spyOn(loanService, 'getLoanById')
        .mockResolvedValue(loanResponseMock);

      const result = await loanController.getLoanById(loanId);

      expect(loanService.getLoanById).toHaveBeenCalledWith(loanId);
      expect(result).toEqual(loanResponseMock);
    });
  });

  describe('payInstallment', () => {
    it('should pay an installment', async () => {
      const repaymentId = '219e9770-7cad-4e73-9b50-9c3501d856ec';

      jest
        .spyOn(loanService, 'payInstallment')
        .mockResolvedValue(repaymentPaidResponseMock);

      const result = await loanController.payInstallment(repaymentId, res);

      expect(loanService.payInstallment).toHaveBeenCalledWith(repaymentId);
      expect(result).toEqual(repaymentPaidResponseMock);
    });
  });
});
