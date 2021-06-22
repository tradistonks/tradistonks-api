import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types as MongooseTypes } from 'mongoose';
import { Permission, PermissionDocument } from 'src/schemas/permission.schema';
import { CreatePermissionBodyDTO } from './dto/create-permission-body.dto';
import { EditPermissionBodyDTO } from './dto/edit-permission-body.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  getPermissions() {
    return this.permissionModel.find();
  }

  createPermission(data: CreatePermissionBodyDTO) {
    return this.permissionModel.create({
      ...data,
    });
  }

  async deletePermission(id: string | MongooseTypes.ObjectId) {
    const { deletedCount } = await this.permissionModel.deleteOne({ _id: id });
    return deletedCount === 1;
  }

  async updatePermission(
    id: string | MongooseTypes.ObjectId,
    data: EditPermissionBodyDTO,
  ) {
    const permission = await this.permissionModel.findById(id);

    if (!permission) {
      return null;
    }

    return await permission.set(data).save();
  }

  async getPermissionsByCodes(...codes: string[]) {
    return await this.permissionModel
      .find({
        code: {
          $in: codes,
        },
      })
      .lean();
  }
}
