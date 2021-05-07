import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Schema as MongooseSchema,
  Types as MongooseTypes,
} from 'mongoose';
import { Language } from './language.schema';
import { User } from './user.schema';

@Schema()
export class SourceFiles {
  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  content: string;
}

export const SourceFilesSchema = SchemaFactory.createForClass(SourceFiles);

export type StrategyDocument = Strategy & Document;

@Schema()
export class Strategy {
  _id?: MongooseTypes.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: MongooseTypes.ObjectId | User;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Language.name,
    required: true,
  })
  language: MongooseTypes.ObjectId | Language;

  @Prop({ type: [SourceFilesSchema], required: true })
  files: SourceFiles[];

  @Prop({ default: Date.now })
  updated_date?: Date;

  @Prop({ default: Date.now })
  created_date?: Date;
}

export const StrategySchema = SchemaFactory.createForClass(Strategy);
