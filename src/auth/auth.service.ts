import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminApi, Configuration } from '@oryd/hydra-client';
import bcrypt from 'bcrypt';
import { Types as MongooseTypes } from 'mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private hydraAdmin = new AdminApi(
    new Configuration({
      basePath: process.env.HYDRA_ADMIN_URL,
    }),
  );

  constructor(private usersService: UsersService) {}

  async login(loginChallenge: string, email: string, password: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);

      if (!user) {
        return null;
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        return null;
      }

      await this.hydraAdmin.getLoginRequest(loginChallenge);

      const {
        data: acceptLoginRequest,
      } = await this.hydraAdmin.acceptLoginRequest(loginChallenge, {
        subject: (user._id as MongooseTypes.ObjectId).toHexString(),
        remember: true,
        remember_for: 3600,
        acr: '0',
      });

      return acceptLoginRequest.redirect_to;
    } catch (e) {
      if (e?.response?.status) {
        throw new BadRequestException('Unknown consent challenge');
      }

      console.error(e);
      return null;
    }
  }

  async consent(consentChallenge: string) {
    try {
      const {
        data: getConsentRequest,
      } = await this.hydraAdmin.getConsentRequest(consentChallenge);

      const {
        data: acceptConsentRequest,
      } = await this.hydraAdmin.acceptConsentRequest(consentChallenge, {
        grant_scope: getConsentRequest.requested_scope,
        grant_access_token_audience:
          getConsentRequest.requested_access_token_audience,
        session: {
          access_token: {
            subject: getConsentRequest.subject,
            scopes: getConsentRequest.requested_scope,
          },
        },
        remember: true,
        remember_for: 3600,
      });

      return acceptConsentRequest.redirect_to;
    } catch (e) {
      if (e?.response?.status) {
        throw new BadRequestException('Unknown consent challenge');
      }

      console.error(e);
      return null;
    }
  }

  async introspect(accessToken: string) {
    const {
      data: introspectRequest,
    } = await this.hydraAdmin.introspectOAuth2Token(accessToken);
    return {
      subject: introspectRequest.sub,
      scopes: introspectRequest.scope.split(' '),
    };
  }
}
