import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/schemas/user.schema';
import { CallbackDataDTO } from '../dto/callback-data.dto';

export const AuthCallbackData = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>()
      .user as CallbackDataDTO;

    return data ? user?.[data] : user;
  },
);
