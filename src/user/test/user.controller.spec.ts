import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';
import {
  CreateUserMock,
  CreateUserResponseMock,
  LoginUserMock,
  LoginUserResponseMock,
} from './mockData/user.mockData';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      jest
        .spyOn(userService, 'createUser')
        .mockResolvedValue(CreateUserResponseMock);

      const result = await userController.createUser(CreateUserMock);

      expect(userService.createUser).toHaveBeenCalledWith(CreateUserMock);
      expect(result).toEqual({
        message: 'User Created Successfully',
        ...CreateUserResponseMock,
      });
    });
  });

  describe('login', () => {
    it('should log in the user successfully', async () => {
      jest.spyOn(userService, 'login').mockResolvedValue('');

      const result = await userController.login(LoginUserMock);

      expect(userService.login).toHaveBeenCalledWith(LoginUserMock);
      expect(result).toEqual({
        ...LoginUserResponseMock,
      });
    });
  });
});
