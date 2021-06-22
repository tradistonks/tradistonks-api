import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { objectIdsToStrings } from 'src/schemas/utils/object-ids-to-strings.interface';
import { Permissions } from 'src/users/guards/decorators/permissions.decorator';
import { UsersService } from 'src/users/users.service';
import { CreateRoleBodyDTO } from './dto/create-role-body.dto';
import { DeleteRoleParamsDTO } from './dto/delete-role-params.dto';
import { EditRoleBodyDTO } from './dto/edit-role-body.dto';
import { EditRoleParamsDTO } from './dto/edit-role-params.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}

  @Get()
  @Permissions(['manage-roles'])
  async getRoles() {
    const roles = await this.rolesService.getRoles();

    return roles.map((role) =>
      objectIdsToStrings(role.toObject({ versionKey: false })),
    );
  }

  @Post()
  @Permissions(['manage-roles'])
  async createRole(@Body() body: CreateRoleBodyDTO) {
    const role = await this.rolesService.createRole(body);

    return objectIdsToStrings(role.toObject({ versionKey: false }));
  }

  @Put(':id')
  @Permissions(['manage-roles'])
  async editRole(
    @Param() params: EditRoleParamsDTO,
    @Body() body: EditRoleBodyDTO,
  ) {
    const role = await this.rolesService.updateRole(params.id, body);

    if (!role) {
      throw new NotFoundException();
    }

    return objectIdsToStrings(role.toObject({ versionKey: false }));
  }

  @Delete(':id')
  @Permissions(['manage-roles'])
  async deleteRole(@Param() params: DeleteRoleParamsDTO) {
    const ok = await this.rolesService.deleteRole(params.id);

    if (!ok) {
      throw new NotFoundException();
    }

    await this.usersService.removeUsersRole(params.id);

    return { ok: true };
  }
}
