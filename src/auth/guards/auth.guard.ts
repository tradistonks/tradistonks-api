import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Session } from 'express-session';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { SessionDTO } from '../../session/dto/session.dto';
import { User } from 'src/schemas/user.schema';

export interface RequestWithSession extends Request {
  session: Session & SessionDTO;
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected authService: AuthService,
    protected usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest<RequestWithSession>();

      const accessToken =
        req.headers['authorization']?.split?.(' ')?.[1] ??
        req.session.refreshToken;

      if (!accessToken) {
        return false;
      }

      const { subject: userId } = await this.authService.introspect(
        accessToken,
      );

      req.user = await this.usersService.getUserById(userId);

      return true;
    } catch (e) {
      return false;
    }
  }
}
