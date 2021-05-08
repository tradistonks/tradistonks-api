import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose';

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

  @Prop({ default: Date.now })
  created_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
