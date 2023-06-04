import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from '@user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '@common/services/auth.service';
import { Errors } from '@common/enums/error.enum';
import { UserHelper } from './user.helper';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  constructor(private authService: AuthService, private helper: UserHelper) {}

  public async createUser(body: CreateUserDto): Promise<CreateUserDto> {
    try {
      const user: User = new User();

      user.userName = body.userName;
      user.password = await this.helper.hashPass(body.password);
      user.isAdmin = body.isAdmin;

      await this.repository.save(user);
      delete body.password;
      return { ...body };
    } catch (error) {
      if (error.message.indexOf('duplicate') != -1) {
        throw new BadRequestException(Errors.USERNAME_ALREADY_EXISTS);
      }
      throw new BadRequestException();
    }
  }

  public async login(body: LoginDto): Promise<string> {
    try {
      const { userName, password } = body;
      const user = await this.repository.findOneOrFail({
        where: { userName },
      });
      await this.helper.isValidUser(password, user.password);
      const token = await this.authService.generateToken({
        userId: user.id,
        userName: user.userName,
        isAdmin: user.isAdmin,
      });
      return token;
    } catch (error) {
      throw new BadRequestException(Errors.INVALID_CREDENTIALS);
    }
  }
}
