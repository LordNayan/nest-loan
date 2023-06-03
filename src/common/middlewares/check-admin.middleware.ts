import { ContextProvider } from '@common/services/http-context.service';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckAdminMiddlware implements NestMiddleware {
  constructor(private contextProvider: ContextProvider) {}
  use(req: Request, res: Response, next: NextFunction) {
    const isAdmin = this.contextProvider.get('isAdmin');
    if (!isAdmin) {
      next(new UnauthorizedException());
    }
    next();
  }
}
