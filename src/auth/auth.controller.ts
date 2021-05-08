import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { LoginBodyDTO } from './dto/login-body.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@AuthUser() user: User, @Body() _body: LoginBodyDTO) {
    return this.authService.login(user);
  }
}
