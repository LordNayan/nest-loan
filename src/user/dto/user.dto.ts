import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'UserName of user',
    example: 'nayan',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Password of user',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Is this an admin?',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;
}

export class CreateUserResponseDto {
  message: string;
  userName: string;
  isAdmin: boolean;
}

export class LoginDto {
  @ApiProperty({
    description: 'UserName of user',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Password of user',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  message: string;
  token: string;
}
