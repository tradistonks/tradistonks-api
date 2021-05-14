import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import {
  Document,
  Schema as MongooseSchema,
  Types as MongooseTypes,
} from 'mongoose';
import { User } from './user.schema';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema()
export class RefreshToken {
  _id: MongooseTypes.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: MongooseTypes.ObjectId;

  @Prop({ default: false })
  is_revoked: boolean;

  @Prop({ default: () => moment().add('6', 'months').toDate() })
  expires: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
