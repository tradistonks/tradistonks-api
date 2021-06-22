import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard, RequestWithSession } from 'src/auth/guards/auth.guard';
import { UsersService } from '../users.service';

@Injectable()
export class PermissionsGuard extends AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    authService: AuthService,
    usersService: UsersService,
  ) {
    super(authService, usersService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionMatrix = this.reflector.get<string[][]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissionMatrix) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithSession>();
    const isLogged = await super.canActivate(context);

    if (!isLogged) {
      return false;
    }

    const hasPermissions = await this.usersService.hasPermissions(
      req.user._id,
      ...permissionMatrix,
    );

    if (hasPermissions) {
      return true;
    }

    return false;
  }
}
