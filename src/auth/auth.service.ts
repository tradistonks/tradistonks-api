import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

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

  login(user: User) {
    const payload = { userId: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
