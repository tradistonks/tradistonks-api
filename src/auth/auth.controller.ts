import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { LoginBodyDTO } from './dto/login-body.dto';
import { RefreshBodyDTO } from './dto/refresh-body.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(
    @Res({ passthrough: true }) res: Response,
    @AuthUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _body: LoginBodyDTO,
  ) {
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    res.cookie('refresh-token', refreshToken);

    return {
      access_token: accessToken,
    };
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshBodyDTO) {
    const {
      token,
    } = await this.authService.generateAccessTokenFromRefreshToken(
      body.refresh_token,
    );

    return {
      access_token: token,
    };
  }
}
