import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Session } from 'express-session';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { SessionDTO } from '../../session/dto/session.dto';

interface RequestWithSession extends Request {
  session: Session & SessionDTO;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    try {
      const req = ctx.switchToHttp().getRequest<RequestWithSession>();

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
