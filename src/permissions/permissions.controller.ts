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
import { RolesService } from 'src/roles/roles.service';
import { objectIdsToStrings } from 'src/schemas/utils/object-ids-to-strings.interface';
import { Permissions } from 'src/users/guards/decorators/permissions.decorator';
import { CreatePermissionBodyDTO } from './dto/create-permission-body.dto';
import { DeletePermissionParamsDTO } from './dto/delete-permission-params.dto';
import { EditPermissionBodyDTO } from './dto/edit-permission-body.dto';
import { EditPermissionParamsDTO } from './dto/edit-permission-params.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private permissionsService: PermissionsService,
    private rolesService: RolesService,
  ) {}

  @Get()
  @Permissions(['manage-permissions'], ['manage-roles'])
  async getPermissions() {
    const permissions = await this.permissionsService.getPermissions();

    return permissions.map((permission) =>
      objectIdsToStrings(permission.toObject({ versionKey: false })),
    );
  }

  @Post()
  @Permissions(['manage-permissions'])
  async createPermission(@Body() body: CreatePermissionBodyDTO) {
    const permission = await this.permissionsService.createPermission(body);

    return objectIdsToStrings(permission.toObject({ versionKey: false }));
  }

  @Put(':id')
  @Permissions(['manage-permissions'])
  async updatePermission(
    @Param() params: EditPermissionParamsDTO,
    @Body() body: EditPermissionBodyDTO,
  ) {
    const permission = await this.permissionsService.updatePermission(
      params.id,
      body,
    );

    if (!permission) {
      throw new NotFoundException();
    }

    return objectIdsToStrings(permission.toObject({ versionKey: false }));
  }

  @Delete(':id')
  @Permissions(['manage-permissions'])
  async deletePermission(@Param() params: DeletePermissionParamsDTO) {
    const ok = await this.permissionsService.deletePermission(params.id);

    if (!ok) {
      throw new NotFoundException();
    }

    await this.rolesService.removeRolesPermission(params.id);

    return { ok };
  }
}
