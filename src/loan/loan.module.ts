import { Module } from '@nestjs/common';
import { LoanController } from '@loan/loan.controller';
import { LoanService } from '@loan/loan.service';
import { LoanHelper } from '@loan/loan.helper';

@Module({
  controllers: [LoanController],
  providers: [LoanService, LoanHelper],
})
export class LoanModule {}
