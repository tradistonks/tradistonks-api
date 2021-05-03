import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    if (await this.usersService.isEmailTaken(body.email)) {
      throw new ConflictException('This email is already taken');
    }

    if (await this.usersService.isUsernameTaken(body.username)) {
      throw new ConflictException('This username is already taken');
    }

    const user = await this.usersService.createUser(body);
    return user.toObject({ versionKey: false });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@AuthUser() user: User) {
    return user;
  }

  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException("This user doesn't exists");
    }

    return user;
  }
}
