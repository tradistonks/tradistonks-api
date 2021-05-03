import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    return await this.userModel
      .findOne({ _id: id })
      .select(['email', 'username', 'created_date']);
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async isEmailTaken(email: string) {
    return await this.userModel.exists({ email });
  }

  async isUsernameTaken(username: string) {
    return await this.userModel.exists({ username });
  }

  async createUser(data: User) {
    return await this.userModel.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });
  }
}
