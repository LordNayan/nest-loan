import { AuthService } from '@common/services/auth.service';
import { ContextProvider } from '@common/services/http-context.service';
import * as httpContext from 'express-http-context';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Errors } from '@common/enums/error.enum';

@Injectable()
export class AuthMiddlware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private contextProvider: ContextProvider,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    httpContext.middleware(req, res, async () => {
      let token: string = req.headers['authorization'] as string;
      if (!token) {
        next(new UnauthorizedException(Errors.INVALID_TOKEN));
        return;
      }
      token =
        token.indexOf('Bearer') !== -1 ? token.replace('Bearer ', '') : token;
      const { isAdmin, userId } = await this.authService.validateAndDecodeToken(
        token,
      );

      if (!userId) next(new UnauthorizedException(Errors.INVALID_TOKEN));
      this.contextProvider.set('isAdmin', isAdmin);
      this.contextProvider.set('userId', userId);
      next();
    });
  }
}
