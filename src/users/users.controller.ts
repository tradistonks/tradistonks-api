import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeanDocument } from 'mongoose';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesService } from 'src/roles/roles.service';
import { Permission } from 'src/schemas/permission.schema';
import { RoleDocument } from 'src/schemas/role.schema';
import { User } from 'src/schemas/user.schema';
import { objectIdsToStrings } from 'src/schemas/utils/object-ids-to-strings.interface';
import { StrategiesService } from 'src/strategies/strategies.service';
import { Replace } from 'src/utils/replace.type';
import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteUserParamsDTO } from './dto/delete-user-params.dto';
import { EditUserBodyDTO } from './dto/edit-user-body.dto';
import { EditUserParamsDTO } from './dto/edit-user-params.dto';
import { Permissions } from './guards/decorators/permissions.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private strategiesService: StrategiesService,
    private rolesService: RolesService,
  ) {}

  @Get()
  @Permissions(['manage-users'])
  async getUsers() {
    const users = await this.usersService.getUsers();

    return users.map((user) =>
      objectIdsToStrings(user.toObject({ versionKey: false })),
    );
  }

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

  @Put(':id')
  @Permissions(['manage-permissions'])
  async updateUser(
    @Param() params: EditUserParamsDTO,
    @Body() body: EditUserBodyDTO,
  ) {
    const permission = await this.usersService.updateUser(params.id, body);

    if (!permission) {
      throw new NotFoundException();
    }

    return objectIdsToStrings(permission.toObject({ versionKey: false }));
  }

  @Delete(':id')
  @Permissions(['manage-permissions'])
  async deleteUser(@Param() params: DeleteUserParamsDTO) {
    const ok = await this.usersService.deleteUser(params.id);

    if (!ok) {
      throw new NotFoundException();
    }

    return { ok };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Get('me/permissions')
  async getCurrentUserPermissions(@AuthUser() user: User) {
    const roles = await this.rolesService
      .getRoles({ _id: user.roles }, ['permissions'])
      .populate('permissions')
      .lean<
        LeanDocument<Replace<RoleDocument, 'permissions', Permission[]>>[]
      >();

    return roles
      .map((role) => role.permissions.map((permission) => permission.code))
      .reduce((acc, val) => acc.concat(val), []);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me/strategies')
  async getCurrentUserStrategies(@AuthUser() user: User) {
    const strategies = await this.strategiesService.getByUserId(user._id);

    return strategies.map((strategy) =>
      strategy.toObject({ versionKey: false }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
