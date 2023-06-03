import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { LoanHelper } from './loan.helper';

@Module({
  controllers: [LoanController],
  providers: [LoanService, LoanHelper],
})
export class LoanModule {}
