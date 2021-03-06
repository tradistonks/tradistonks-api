import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { AdminApi, Configuration, OAuth2Client } from '@ory/hydra-client';
import bcrypt from 'bcrypt';
import { Types as MongooseTypes } from 'mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private hydraAdmin = new AdminApi(
    new Configuration({
      basePath: process.env.HYDRA_ADMIN_URL,
    }),
  );

  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    const configs: OAuth2Client[] = [
      {
        client_id: process.env.OAUTH2_CLIENT_ID,
        client_secret: process.env.OAUTH2_CLIENT_SECRET,
        grant_types: [
          'authorization_code',
          'refresh_token',
          'client_credentials',
        ],
        response_types: ['token', 'code'],
        scope: 'offline identify',
        redirect_uris: [process.env.OAUTH2_LOCAL_REDIRECT_URL],
        token_endpoint_auth_method: 'client_secret_post',
      },
      {
        client_id: process.env.OAUTH2_MOBILE_CLIENT_ID,
        client_secret: process.env.OAUTH2_MOBILE_CLIENT_SECRET,
        grant_types: [
          'authorization_code',
          'refresh_token',
          'client_credentials',
        ],
        response_types: ['token', 'code'],
        scope: 'offline identify',
        redirect_uris: [process.env.OAUTH2_MOBILE_LOCAL_REDIRECT_URL],
        token_endpoint_auth_method: 'client_secret_post',
      },
    ];

    this.createOrUpdateOAuth2Clients(configs);
  }

  private async createOrUpdateOAuth2Clients(configs: OAuth2Client[]) {
    const promises = configs.map(async (config) => {
      try {
        await this.hydraAdmin.getOAuth2Client(config.client_id);
        await this.hydraAdmin.updateOAuth2Client(config.client_id, config);
      } catch (error) {
        await this.hydraAdmin.createOAuth2Client(config);
      }
    });

    return await Promise.all(promises);
  }

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

      const { data: acceptLoginRequest } =
        await this.hydraAdmin.acceptLoginRequest(loginChallenge, {
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
      const { data: getConsentRequest } =
        await this.hydraAdmin.getConsentRequest(consentChallenge);

      const { data: acceptConsentRequest } =
        await this.hydraAdmin.acceptConsentRequest(consentChallenge, {
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

  async getConsent(consentChallenge: string) {
    const { data: getConsentRequest } = await this.hydraAdmin.getConsentRequest(
      consentChallenge,
    );

    return {
      client_id: getConsentRequest.client.client_id,
    };
  }

  async introspect(accessToken: string) {
    const { data: introspectRequest } =
      await this.hydraAdmin.introspectOAuth2Token(accessToken);

    if (!introspectRequest.active) {
      throw new ForbiddenException(`Invalid or expired access token`);
    }

    return {
      subject: introspectRequest.sub,
      scopes: introspectRequest.scope.split(' '),
    };
  }
}
