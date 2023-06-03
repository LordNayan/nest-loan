import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '@common/services/auth.service';
import { Errors } from '@common/enums/error.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  constructor(private authService: AuthService) {}

  public async createUser(body: CreateUserDto) {
    const user: User = new User();

    user.userName = body.userName;
    user.password = await hashPass(body.password);
    user.isAdmin = body.isAdmin;

    await this.repository.save(user);
    delete body.password;
    return { ...body };
  }

  public async login(body: LoginDto) {
    try {
      const { userName, password } = body;
      const user = await this.repository.findOneOrFail({
        where: { userName },
      });

      await isValidUser(password, user.password);

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
async function hashPass(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function isValidUser(password, hashedPass): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPass);
  if (!isMatch) throw new Error();
  return true;
}
