import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {
  _id: MongooseTypes.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
