import { Injectable } from '@nestjs/common';
import * as httpContext from 'express-http-context';

@Injectable()
export class ContextProvider {
  get(key: string): unknown {
    return httpContext.get(key);
  }

  set(key: string, value: any) {
    return httpContext.set(key, value);
  }
}
