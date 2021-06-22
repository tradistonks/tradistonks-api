import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Schema as MongooseSchema,
  Types as MongooseTypes,
} from 'mongoose';
import { Role } from './role.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: MongooseTypes.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [
      { type: MongooseSchema.Types.ObjectId, ref: Role.name, required: true },
    ],
    default: [],
  })
  roles: MongooseTypes.ObjectId[];

  @Prop({ default: Date.now })
  created_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
