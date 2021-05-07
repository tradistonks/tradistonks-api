import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  login(user: User) {
    const payload = { userId: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
