import {
  Body,
  Controller,
  Query,
  Post,
  UnauthorizedException,
  UseGuards,
  Session,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCallbackData } from './decorators/auth-callback-data.decorator';
import { CallbackDataDTO } from './dto/callback-data.dto';
import { ConsentBodyDTO } from './dto/consent-body.dto';
import { LocalCallbackQueriesDTO } from './dto/local-callback-queries.dto';
import { LoginBodyDTO } from './dto/login-body.dto';
import { SessionDTO } from '../session/dto/session.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    const redirect_to = await this.authService.login(
      body.login_challenge,
      body.email,
      body.password,
    );

    if (!redirect_to) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      redirect_to,
    };
  }

  @Post('consent')
  async consent(@Body() body: ConsentBodyDTO) {
    const redirect_to = await this.authService.consent(body.consent_challenge);

    if (!redirect_to) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      redirect_to,
    };
  }

  @UseGuards(AuthGuard('oauth2'))
  @Post('callback/local')
  async localCallback(
    @AuthCallbackData() data: CallbackDataDTO,
    @Session() session: SessionDTO,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query() _queries: LocalCallbackQueriesDTO,
  ) {
    session.userId = data.userId;
    session.accessToken = data.accessToken;
    session.refreshToken = data.refreshToken;

    return { ok: true };
  }
}
