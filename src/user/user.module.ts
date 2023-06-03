import { Module } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { UserHelper } from './user.helper';

@Module({
  controllers: [UserController],
  providers: [UserService, UserHelper],
})
export class UserModule {}
