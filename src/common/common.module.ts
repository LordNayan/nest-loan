import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ContextProvider } from '@common/services/http-context.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/database/entities/user.entity';
import { Loan } from '@src/database/entities/loan.entity';
import { Repayment } from '@src/database/entities/repayment.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Loan, Repayment])],
  controllers: [],
  providers: [AuthService, JwtService, ContextProvider],
  exports: [
    AuthService,
    ContextProvider,
    TypeOrmModule.forFeature([User, Loan, Repayment]),
  ],
})
export class CommonModule {}
