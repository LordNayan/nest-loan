import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UserService } from '@user/user.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
  LoginDto,
  LoginResponseDto,
} from '@user/user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: `User Created Successfully`,
  })
  @ApiBadRequestResponse({
    description: `Request payload is not correct`,
  })
  @Post('/')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const data = await this.userService.createUser(createUserDto);
    return { message: 'User Created Successfully', ...data };
  }

  @ApiOperation({ summary: 'Login with username and password.' })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    description: `User Logged-In Successfully`,
  })
  @ApiBadRequestResponse({
    description: `Request payload is not correct`,
  })
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const token = await this.userService.login(loginDto);
    response.status(HttpStatus.OK);
    return { message: 'User Logged-In Successfully', token };
  }
}
