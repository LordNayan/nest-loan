import { Test } from '@nestjs/testing';
import { LoanService } from '@loan/loan.service';
import { Repository } from 'typeorm';
import { Loan } from '@src/database/entities/loan.entity';
import { User } from '@src/database/entities/user.entity';
import { Repayment } from '@src/database/entities/repayment.entity';
import { ContextProvider } from '@common/services/http-context.service';
import { LoanHelper } from '@loan/loan.helper';
import { CreateLoanDto, CreateLoanResponseDto } from '@loan/dto/loan.dto';
import {
  GenerateRepaymentsResponse,
  LoanDataMock,
  RepaymentLoanPendingMock,
  RepaymentMock,
  repaymentPaidResponseMock,
} from './mockData/loan.mockData';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RepaymentStatus } from '@common/enums/loan.enum';

describe('LoanService', () => {
  let loanService: LoanService;
  let userRepository: Repository<User>;
  let loanRepository: Repository<Loan>;
  let repaymentRepository: Repository<Repayment>;
  let contextProvider: ContextProvider;
  let loanHelper: LoanHelper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoanService,
        LoanHelper,
        {
          provide: ContextProvider,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: 'LoanRepository',
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: 'RepaymentRepository',
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    loanService = moduleRef.get<LoanService>(LoanService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    loanRepository = moduleRef.get<Repository<Loan>>(getRepositoryToken(Loan));
    repaymentRepository = moduleRef.get<Repository<Repayment>>(
      getRepositoryToken(Repayment),
    );
    contextProvider = moduleRef.get<ContextProvider>(ContextProvider);
    loanHelper = moduleRef.get<LoanHelper>(LoanHelper);
  });

  describe('createLoan', () => {
    it('should create a new loan and save the repayments', async () => {
      // Arrange
      const payload: CreateLoanDto = {
        amount: 1000,
        term: 12,
      };

      jest.spyOn(contextProvider, 'get').mockReturnValue('userId');
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(LoanDataMock.user);
      jest.spyOn(loanRepository, 'save').mockResolvedValue(LoanDataMock);
      jest
        .spyOn(loanHelper, 'generateRepayments')
        .mockReturnValue(GenerateRepaymentsResponse);
      jest
        .spyOn(repaymentRepository, 'save')
        .mockResolvedValue(repaymentPaidResponseMock.repayment);

      // Act
      const result: CreateLoanResponseDto = await loanService.createLoan(
        payload,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.loan.id).toEqual(LoanDataMock.id);
      expect(result.loan.repayments.length).toEqual(
        GenerateRepaymentsResponse.length,
      );
    });
  });

  describe('approveLoan', () => {
    it('should approve a loan', async () => {
      // Mock the necessary dependencies and their methods
      const findOneLoanSpy = jest
        .spyOn(loanRepository, 'findOne')
        .mockResolvedValue(LoanDataMock);
      const saveLoanSpy = jest
        .spyOn(loanRepository, 'save')
        .mockResolvedValue(LoanDataMock);

      const result = await loanService.approveLoan('1');

      expect(findOneLoanSpy).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(saveLoanSpy).toHaveBeenCalledWith(
        expect.objectContaining(LoanDataMock),
      );
      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining(LoanDataMock));
    });

    it('should throw BadRequestException if loan is already approved or paid', async () => {
      // Mock the necessary dependencies and their methods
      const findOneLoanSpy = jest
        .spyOn(loanRepository, 'findOne')
        .mockResolvedValue(LoanDataMock);

      const loanId = '1';

      await expect(loanService.approveLoan(loanId)).rejects.toThrow(
        BadRequestException,
      );
      expect(findOneLoanSpy).toHaveBeenCalledWith({ where: { id: loanId } });
    });

    it('should throw BadRequestException if loan not found', async () => {
      // Mock the necessary dependencies and their methods
      const findOneLoanSpy = jest
        .spyOn(loanRepository, 'findOne')
        .mockResolvedValue(null);

      const loanId = '1';

      await expect(loanService.approveLoan(loanId)).rejects.toThrow(
        BadRequestException,
      );
      expect(findOneLoanSpy).toHaveBeenCalledWith({ where: { id: loanId } });
    });
  });

  describe('getLoans', () => {
    it('should get all loans associated with a user', async () => {
      // Mock the necessary dependencies and their methods
      const userId = '1';
      jest.spyOn(contextProvider, 'get').mockReturnValue(userId);
      const findOneUserSpy = jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValue(LoanDataMock.user);

      const result = await loanService.getLoans();
      expect(findOneUserSpy).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['loans'],
      });
      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining(LoanDataMock.user));
    });

    it('should throw NotFoundException if the user is not found', async () => {
      // Mock the necessary dependencies and their methods
      const userId = '1';
      jest.spyOn(contextProvider, 'get').mockReturnValue(userId);
      const findOneUserSpy = jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundException());

      await expect(loanService.getLoans()).rejects.toThrow(NotFoundException);
      expect(findOneUserSpy).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['loans'],
      });
    });
  });

  describe('getLoanById', () => {
    it('should get a loan by its id associated with a user', async () => {
      // Mock the necessary dependencies and their methods
      const userId = '1';
      jest.spyOn(contextProvider, 'get').mockReturnValue(userId);
      const findOneLoanSpy = jest
        .spyOn(loanRepository, 'findOneOrFail')
        .mockResolvedValue(LoanDataMock);

      const result = await loanService.getLoanById('loanId');
      expect(findOneLoanSpy).toHaveBeenCalledWith({
        where: { id: LoanDataMock.id, user: userId },
        relations: ['repayments'],
      });
      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining(LoanDataMock));
    });

    it('should throw NotFoundException if the loan is not found', async () => {
      // Mock the necessary dependencies and their methods
      const userId = '1';
      jest.spyOn(contextProvider, 'get').mockReturnValue(userId);
      contextProvider.set('userId', userId);
      const findOneLoanSpy = jest
        .spyOn(loanRepository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundException('Loan not found'));

      await expect(
        loanService.getLoanById(LoanDataMock.id),
      ).rejects.toThrowError(NotFoundException);

      expect(findOneLoanSpy).toHaveBeenCalledWith({
        where: { id: 'loanId', user: userId },
        relations: ['repayments'],
      });
    });
  });

  describe('payInstallment', () => {
    it('should mark the repayment as paid and return the repayment object', async () => {
      // Mock the necessary dependencies and their methods
      const repaymentId = '1';
      const findOneRepaymentSpy = jest
        .spyOn(repaymentRepository, 'findOne')
        .mockResolvedValue(RepaymentMock as Repayment);
      const saveRepaymentSpy = jest.spyOn(repaymentRepository, 'save');
      const isLoanPaidSpy = jest
        .spyOn(loanHelper, 'isLoanPaid')
        .mockResolvedValue(false);

      const result = await loanService.payInstallment(repaymentId);

      expect(findOneRepaymentSpy).toHaveBeenCalledWith({
        where: { id: repaymentId },
        relations: ['loan'],
      });
      expect(saveRepaymentSpy).toHaveBeenCalledWith({
        ...RepaymentMock,
        status: RepaymentStatus.Paid,
      });
      expect(isLoanPaidSpy).toHaveBeenCalledWith(RepaymentMock.loan);
      expect(result).toEqual({ repayment: RepaymentMock });
    });

    it('should throw BadRequestException if the repayment is already paid', async () => {
      // Mock the necessary dependencies and their methods
      const repaymentId = '1';
      const findOneRepaymentSpy = jest
        .spyOn(repaymentRepository, 'findOne')
        .mockResolvedValue(RepaymentMock as Repayment);

      await expect(
        loanService.payInstallment(repaymentId),
      ).rejects.toThrowError(BadRequestException);

      expect(findOneRepaymentSpy).toHaveBeenCalledWith({
        where: { id: repaymentId },
        relations: ['loan'],
      });
    });

    it('should throw BadRequestException if the repayment is not found', async () => {
      // Mock the necessary dependencies and their methods
      const repaymentId = '1';
      const findOneRepaymentSpy = jest
        .spyOn(repaymentRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(
        loanService.payInstallment(repaymentId),
      ).rejects.toThrowError(BadRequestException);

      expect(findOneRepaymentSpy).toHaveBeenCalledWith({
        where: { id: repaymentId },
        relations: ['loan'],
      });
    });

    it('should throw BadRequestException if the associated loan is still pending', async () => {
      // Mock the necessary dependencies and their methods
      const repaymentId = '1';
      const findOneRepaymentSpy = jest
        .spyOn(repaymentRepository, 'findOne')
        .mockResolvedValue(RepaymentLoanPendingMock as Repayment);

      await expect(
        loanService.payInstallment(repaymentId),
      ).rejects.toThrowError(BadRequestException);

      expect(findOneRepaymentSpy).toHaveBeenCalledWith({
        where: { id: repaymentId },
        relations: ['loan'],
      });
    });

    it('should mark the repayment as paid and also the payment as paid', async () => {
      // Mock the necessary dependencies and their methods
      const repaymentId = '1';
      const RepaymentPendingMock = { ...RepaymentMock };
      RepaymentPendingMock.status = RepaymentStatus.Pending;
      const findOneRepaymentSpy = jest
        .spyOn(repaymentRepository, 'findOne')
        .mockResolvedValue(RepaymentPendingMock as Repayment);
      const saveRepaymentSpy = jest.spyOn(repaymentRepository, 'save');
      const isLoanPaidSpy = jest
        .spyOn(loanHelper, 'isLoanPaid')
        .mockResolvedValue(true);

      const result = await loanService.payInstallment(repaymentId);

      expect(findOneRepaymentSpy).toHaveBeenCalledWith({
        where: { id: repaymentId },
        relations: ['loan'],
      });
      expect(saveRepaymentSpy).toHaveBeenCalledWith({
        ...RepaymentPendingMock,
        status: RepaymentStatus.Paid,
      });
      expect(isLoanPaidSpy).toHaveBeenCalledWith(RepaymentPendingMock.loan);
      expect(result).toEqual({ repayment: RepaymentPendingMock });
    });
  });
});
