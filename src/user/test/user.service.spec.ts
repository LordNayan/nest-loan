import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@user/user.service';
import { Repository } from 'typeorm';
import { User } from '@src/database/entities/user.entity';
import { AuthService } from '@common/services/auth.service';
import { UserHelper } from '@user/user.helper';
import {
  CreateUserMock,
  CreateUserServiceResponseMock,
  LoginUserMock,
} from './mockData/user.mockData';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoanDataMock } from '@loan/test/mockData/loan.mockData';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let authService: AuthService;
  let userHelper: UserHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
        {
          provide: UserHelper,
          useValue: {
            hashPass: jest.fn(),
            isValidUser: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authService = module.get<AuthService>(AuthService);
    userHelper = module.get<UserHelper>(UserHelper);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(userHelper, 'hashPass').mockResolvedValue('hashedPassword');

      const result = await userService.createUser(CreateUserMock);

      expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(result).toEqual(CreateUserServiceResponseMock);
    });
  });

  describe('login', () => {
    it('should log in the user successfully', async () => {
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValue(LoanDataMock.user);
      jest.spyOn(userHelper, 'isValidUser').mockResolvedValue(true);
      jest.spyOn(authService, 'generateToken').mockResolvedValue('token');

      const result = await userService.login(LoginUserMock);

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(userHelper.isValidUser).toHaveBeenCalledWith(
        LoginUserMock.password,
        LoanDataMock.user.password,
      );
      expect(authService.generateToken).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toBe('token');
    });

    it('should throw error in case of invalid credentials', async () => {
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValue(new BadRequestException());

      await expect(userService.login(LoginUserMock)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
