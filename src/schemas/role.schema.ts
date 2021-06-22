import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Schema as MongooseSchema,
  Types as MongooseTypes,
} from 'mongoose';
import { Permission } from './permission.schema';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  _id: MongooseTypes.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: Permission.name,
        required: true,
      },
    ],
    required: true,
  })
  permissions: MongooseTypes.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
