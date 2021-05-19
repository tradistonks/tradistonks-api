import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CallbackDataDTO } from '../dto/callback-data.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalOAuth2CodeStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: `${process.env.OAUTH2_SERVER_INTERNAL_HOST}/oauth2/auth`,
      tokenURL: `${process.env.OAUTH2_SERVER_INTERNAL_HOST}/oauth2/token`,
      clientID: process.env.OAUTH2_CLIENT_ID,
      clientSecret: process.env.OAUTH2_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_EXTERNAL_HOST}/oauth2/callback`,
      scope: 'identify offline',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
  ): Promise<CallbackDataDTO> {
    const { subject: userId } = await this.authService.introspect(accessToken);

    return {
      userId,
      accessToken,
      refreshToken,
    };
  }
}
