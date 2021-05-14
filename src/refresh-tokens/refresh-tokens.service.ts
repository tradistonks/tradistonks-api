import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types as MongooseTypes } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from 'src/schemas/refresh-token.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  createRefreshToken(user: User) {
    return this.refreshTokenModel.create({
      user: user._id,
    });
  }

  getRefreshTokenById(id: string | MongooseTypes.ObjectId) {
    return this.refreshTokenModel.findOne({ _id: id });
  }
}
