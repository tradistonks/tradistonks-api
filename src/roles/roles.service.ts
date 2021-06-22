import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types as MongooseTypes } from 'mongoose';

import { Role, RoleDocument } from 'src/schemas/role.schema';

import { CreateRoleBodyDTO } from './dto/create-role-body.dto';
import { EditRoleBodyDTO } from './dto/edit-role-body.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  getRoles() {
    return this.roleModel.find();
  }

  createRole(data: CreateRoleBodyDTO) {
    return this.roleModel.create({
      ...data,
      permissions: data.permissions.map((id) => MongooseTypes.ObjectId(id)),
    });
  }

  async deleteRole(id: string | MongooseTypes.ObjectId) {
    const { deletedCount } = await this.roleModel.deleteOne({ _id: id });
    return deletedCount === 1;
  }

  async updateRole(id: string | MongooseTypes.ObjectId, data: EditRoleBodyDTO) {
    const role = await this.roleModel.findById(id);

    if (!role) {
      return null;
    }

    return await role.set(data).save();
  }

  removeRolesPermission(permissionId: string) {
    return this.roleModel.updateMany(
      {},
      {
        $pull: {
          permissions: permissionId,
        },
      },
    );
  }
}
