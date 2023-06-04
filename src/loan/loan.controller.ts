import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { LoanService } from '@loan/loan.service';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateLoanDto,
  CreateLoanResponseDto,
  RepaymentPaidResponse,
} from '@loan/dto/loan.dto';
import { Loan } from '@src/database/entities/loan.entity';
import { User } from '@src/database/entities/user.entity';
import { Response } from 'express';

@ApiTags('loan')
@Controller('loan')
@ApiBearerAuth()
export class LoanController {
  constructor(private loanService: LoanService) {}

  @ApiOperation({ summary: 'Create a new loan.' })
  @ApiBody({
    type: CreateLoanDto,
  })
  @ApiOkResponse({
    status: 201,
    description: `success`,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `Request payload is not correct`,
  })
  @Post('/')
  async createLoan(
    @Body() payload: CreateLoanDto,
  ): Promise<CreateLoanResponseDto> {
    return this.loanService.createLoan(payload);
  }

  @ApiOperation({ summary: 'Approve a loan.' })
  @ApiOkResponse({
    status: 200,
    description: `success`,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `Request payload is not correct`,
  })
  @ApiParam({
    name: 'loanId',
    type: 'String',
    required: true,
    example: '219e9770-7cad-4e73-9b50-9c3501d856ec',
  })
  @Post('/approveLoan/:loanId')
  async approveLoan(
    @Param('loanId') loanId,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Partial<Loan>> {
    const result = await this.loanService.approveLoan(loanId);
    response.status(HttpStatus.OK);
    return result;
  }

  @ApiOperation({ summary: 'Get all loans associated to a user' })
  @ApiOkResponse({
    status: 200,
    description: `success`,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `Request payload is not correct`,
  })
  @Get('/')
  async getLoans(): Promise<Partial<User>> {
    return this.loanService.getLoans();
  }

  @ApiOperation({ summary: 'Get single loan information associated to a user' })
  @ApiOkResponse({
    status: 200,
    description: `success`,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `Request payload is not correct`,
  })
  @ApiParam({
    name: 'loanId',
    type: 'String',
    required: true,
    example: '219e9770-7cad-4e73-9b50-9c3501d856ec',
  })
  @Get('/:loanId')
  async getLoanById(@Param('loanId') loanId): Promise<Loan> {
    return this.loanService.getLoanById(loanId);
  }

  @ApiOperation({ summary: 'Pay an installment by providing its id' })
  @ApiOkResponse({
    status: 200,
    description: `success`,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `Request payload is not correct`,
  })
  @ApiParam({
    name: 'repaymentId',
    type: 'String',
    required: true,
    example: '219e9770-7cad-4e73-9b50-9c3501d856ec',
  })
  @Post('/:repaymentId')
  async payInstallment(
    @Param('repaymentId') repaymentId,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RepaymentPaidResponse> {
    const result = await this.loanService.payInstallment(repaymentId);
    response.status(HttpStatus.OK);
    return result;
  }
}
