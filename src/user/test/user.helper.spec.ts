import * as bcrypt from 'bcrypt';
import { UserHelper } from '@user/user.helper';

describe('UserHelper', () => {
  let userHelper: UserHelper;

  beforeEach(() => {
    userHelper = new UserHelper();
  });

  describe('hashPass', () => {
    it('should hash the password', async () => {
      const password = 'password';
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const result = await userHelper.hashPass(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('isValidUser', () => {
    it('should validate a valid user', async () => {
      const password = 'password';
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await userHelper.isValidUser(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should throw an error for an invalid user', async () => {
      const password = 'password';
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        userHelper.isValidUser(password, hashedPassword),
      ).rejects.toThrow(Error);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    // Add more test cases for different scenarios, errors, etc.
  });
});
