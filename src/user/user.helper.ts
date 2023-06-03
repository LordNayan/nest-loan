import * as bcrypt from 'bcrypt';

export class UserHelper {
  public async hashPass(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async isValidUser(password, hashedPass): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPass);
    if (!isMatch) throw new Error();
    return true;
  }
}
