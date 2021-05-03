import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@AuthUser() user: User) {
    return this.authService.login(user);
  }
}
