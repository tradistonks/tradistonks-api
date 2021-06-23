import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { LeanDocument, Model, Types as MongooseTypes } from 'mongoose';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Role } from 'src/schemas/role.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { EditUserBodyDTO } from './dto/edit-user-body.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private permissionsService: PermissionsService,
  ) {}

  getUsers() {
    return this.userModel.find();
  }

  getUserById(
    id: string | MongooseTypes.ObjectId,
    select?: { [K in keyof User]?: 0 | 1 },
  ) {
    return this.userModel
      .findOne({ _id: id })
      .select(select ?? { password: 0 });
  }

  getUserByUsername(username: string) {
    return this.userModel.findOne({ username }).select({ password: 0 });
  }

  getUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async isEmailTaken(email: string) {
    return await this.userModel.exists({ email });
  }

  async isUsernameTaken(username: string) {
    return await this.userModel.exists({ username });
  }

  async createUser(data: CreateUserDTO) {
    return await this.userModel.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });
  }

  async deleteUser(id: string | MongooseTypes.ObjectId) {
    const user = await this.userModel.findById(id);

    if (!user) {
      return false;
    }

    await user.set({ active: false }).save();

    return true;
  }

  async updateUser(id: string | MongooseTypes.ObjectId, data: EditUserBodyDTO) {
    const user = await this.userModel.findById(id);

    if (!user) {
      return null;
    }

    return await user.set(data).save();
  }

  removeUsersRole(roleId: string) {
    return this.userModel.updateMany(
      {},
      {
        $pull: {
          roles: roleId,
        },
      },
    );
  }

  async getUserRolesById(id: string | MongooseTypes.ObjectId) {
    const user = await this.getUserById(id, { roles: 1 })
      .populate(['roles'])
      .lean<LeanDocument<Omit<UserDocument, 'roles'> & { roles: Role[] }>>();

    return user?.roles;
  }

  private async hasPermissionsCodes(
    roles: (Pick<Role, '_id' | 'name'> & {
      permissions: MongooseTypes.ObjectId[];
    })[],
    permissionCodes: string[],
  ) {
    const permissions = await this.permissionsService.getPermissionsByCodes(
      ...permissionCodes,
    );

    for (const code of permissionCodes) {
      const permission = permissions.find((a) => a.code === code);

      if (!permission) {
        console.error(`hasPermissions: permission '${code}' doesn't exists.`);
        return false;
      }

      if (
        !roles.some((role) =>
          role.permissions.some((a) => a.equals(permission._id)),
        )
      ) {
        return false;
      }
    }

    return true;
  }

  async hasPermissions(
    userId: string | MongooseTypes.ObjectId,
    ...permissionMatrix: string[][]
  ) {
    const roles = await this.getUserRolesById(userId);

    if (!roles) {
      return false;
    }

    for (const permissionCodes of permissionMatrix) {
      if (await this.hasPermissionsCodes(roles, permissionCodes)) {
        return true;
      }
    }

    return false;
  }
}
