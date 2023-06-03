import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '@common/services/auth.service';
import { Errors } from '@common/enums/error.enum';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  constructor(private authService: AuthService) {}

  public async createUser(body: CreateUserDto) {
    const user: User = new User();

    user.userName = body.userName;
    user.password = body.password;
    user.isAdmin = body.isAdmin;

    await this.repository.save(user);
    delete body.password;
    return { ...body };
  }

  public async login(body: LoginDto) {
    try {
      const { userName, password } = body;
      const user = await this.repository.findOneOrFail({
        where: { userName, password },
      });
      const token = await this.authService.generateToken({
        userId: user.id,
        userName: user.userName,
        isAdmin: user.isAdmin,
      });
      delete user.password;
      return token;
    } catch (error) {
      throw new BadRequestException(Errors.INVALID_CREDENTIALS);
    }
  }
}
