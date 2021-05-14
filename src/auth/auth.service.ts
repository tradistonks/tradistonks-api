import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';
import { RefreshToken } from 'src/schemas/refresh-token.schema';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { TokenExpiredError } from 'jsonwebtoken';
import moment from 'moment';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokensService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    if (await bcrypt.compare(password, user.password)) {
      return {
        _id: user._id,
        email: user.email,
        username: user.username,
        created_date: user.created_date,
      };
    }

    return null;
  }

  async generateAccessToken(user: User) {
    return await this.jwtService.signAsync(
      {},
      {
        subject: user._id.toHexString(),
      },
    );
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token = await this.refreshTokenService.createRefreshToken(user);

    return await this.jwtService.signAsync(
      {},
      {
        expiresIn: Math.abs(moment().diff(token.expires, 'seconds')),
        subject: user._id.toHexString(),
        jwtid: token._id.toHexString(),
      },
    );
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{
    user: User;
    token: RefreshToken;
  }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.refreshTokenService.getRefreshTokenById(
      payload.jti,
    );

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.is_revoked) {
      throw new UnprocessableEntityException('Revoked refresh token');
    }

    const user = await this.usersService.getUserById(payload.sub);

    if (!user) {
      throw new UnprocessableEntityException('Malformed refresh token');
    }

    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token has expired');
      } else {
        throw new UnprocessableEntityException('Malformed refresh token');
      }
    }
  }

  public async generateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<{ token: string; user: User }> {
    const { user } = await this.resolveRefreshToken(refreshToken);
    const token = await this.generateAccessToken(user);

    return { user, token };
  }
}
