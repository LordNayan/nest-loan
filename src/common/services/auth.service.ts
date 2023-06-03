import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly secretKey: string = 'your-secret-key';
  constructor(private jwtService: JwtService) {}
  public async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.secretKey,
    });
  }

  public async validateAndDecodeToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.secretKey,
      });
      return decoded;
    } catch (error) {
      return new UnauthorizedException('Invalid token');
    }
  }
}
