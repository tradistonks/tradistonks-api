import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model, Types as MongooseTypes } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getUserById(id: string | MongooseTypes.ObjectId) {
    return this.userModel.findOne({ _id: id }).select({ password: 0 });
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

  async createUser(data: Omit<User, '_id'>) {
    return await this.userModel.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });
  }
}
