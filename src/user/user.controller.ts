import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
  LoginDto,
  LoginResponseDto,
} from './user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

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
    description: `User Created Succesfully`,
  })
  @ApiBadRequestResponse({
    description: `Request payload is not correct`,
  })
  @Post('/')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const data = await this.userService.createUser(createUserDto);
    return { message: 'User Created Succesfully', ...data };
  }

  @ApiOperation({ summary: 'Login with username and password.' })
  @ApiBody({
    type: LoginDto,
  })
  @ApiCreatedResponse({
    description: `User Logged-In Succesfully`,
  })
  @ApiBadRequestResponse({
    description: `Request payload is not correct`,
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.userService.login(loginDto);
    return { message: 'User Logged-In Succesfully', token };
  }
}
