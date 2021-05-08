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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/schemas/user.schema';
import { StrategiesService } from 'src/strategies/strategies.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private strategiesService: StrategiesService,
  ) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    if (await this.usersService.isEmailTaken(body.email)) {
      throw new ConflictException('This email is already taken');
    }

    if (await this.usersService.isUsernameTaken(body.username)) {
      throw new ConflictException('This username is already taken');
    }

    const user = await this.usersService.createUser(body);

    delete user.password;
    return user.toObject({ versionKey: false });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@AuthUser() user: User) {
    return user;
  }

  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.getUserByUsername(username);

    if (!user) {
      throw new NotFoundException("This user doesn't exists");
    }

    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/strategies')
  async getCurrentUserStrategies(@AuthUser() user: User) {
    const strategies = await this.strategiesService.getByUserId(user._id);

    return strategies.map((strategy) =>
      strategy.toObject({ versionKey: false }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':username/strategies')
  async getUserStrategies(@Param('username') username: string) {
    const user = await this.usersService.getUserByUsername(username);

    if (!user) {
      throw new NotFoundException("This user doesn't exists");
    }

    const strategies = await this.strategiesService.getByUserId(user._id);

    return strategies.map((strategy) =>
      strategy.toObject({ versionKey: false }),
    );
  }
}
