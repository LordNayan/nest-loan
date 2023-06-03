import { LoanStatus, RepaymentStatus } from '@common/enums/loan.enum';
import { Loan } from '@database/entities/loan.entity';
import { User } from '@database/entities/user.entity';

export const CreateLoanMock = {
  amount: 100,
  term: 3,
};

export const loanResponseMock = {
  id: 'mock-id',
  term: 3,
  amount: 100,
  status: LoanStatus.Pending,
  repayments: [
    {
      amount: 100,
      dueDate: new Date(),
      status: RepaymentStatus.Pending,
    },
  ],
} as Loan;

export const LoanDataMock: Loan = {
  id: 'loanId',
  amount: 10000,
  term: 3,
  status: LoanStatus.Pending,
  user: {
    id: 'userId',
    userName: 'testuser',
    password: 'testpassword',
    isAdmin: false,
    loans: [],
    createdAt: new Date(),
  } as User,
  repayments: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const CreateLoanResponseMock = {
  loan: {
    id: 'mock-id',
    term: 3,
    amount: 100,
    status: LoanStatus.Pending,
    repayments: [
      {
        amount: 100,
        dueDate: new Date(),
        status: RepaymentStatus.Pending,
      },
    ],
  },
};

export const ApproveLoanResponseMock = {
  id: 'f8dfdbc4-60d9-414e-b494-3eeaa8db6e29',
  amount: 10000.0,
  term: 3,
  status: 'APPROVED',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const getLoansResponseMock = {
  id: '06feb9c6-0228-4a8d-af53-16f2ac66ed64',
  userName: 'nayan',
  password: '',
  isAdmin: false,
  createdAt: new Date(),
  loans: [
    {
      id: 'f8dfdbc4-60d9-414e-b494-3eeaa8db6e29',
      amount: 10000,
      term: 3,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Loan,
  ],
};

export const repaymentPaidResponseMock = {
  repayment: {
    id: '302608c6-9c50-4132-b99c-3606509a8058',
    amount: 3333.33,
    dueDate: new Date(),
    status: 'PAID',
    loan: LoanDataMock,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const FindUserMock = {
  id: '06feb9c6-0228-4a8d-af53-16f2ac66ed64',
  userName: 'nayan',
  password: '',
  isAdmin: false,
  createdAt: new Date(),
  loans: loanResponseMock,
};

export const GenerateRepaymentsResponse = [{ amount: 100, date: new Date() }];

export const RepaymentMock = {
  id: 'repaymentId',
  status: RepaymentStatus.Pending,
  loan: {
    id: 'loanId',
    status: LoanStatus.Approved,
  },
};

export const RepaymentLoanPendingMock = {
  id: 'repaymentId',
  status: RepaymentStatus.Pending,
  loan: {
    id: 'loanId',
    status: LoanStatus.Pending,
  },
};

export const RepaymentLoanMock = {
  id: '1',
  status: RepaymentStatus.Pending,
  amount: 3333.33,
  dueDate: new Date().toISOString().replace('T', ' ').slice(0, -1),
  loan: {
    id: 'loanId',
    amount: 10000,
    term: 3,
    status: LoanStatus.Pending,
  },
};

export const RepaymentMockArray = [repaymentPaidResponseMock.repayment];
