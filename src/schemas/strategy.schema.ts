import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Schema as MongooseSchema,
  Types as MongooseTypes,
} from 'mongoose';
import { User } from './user.schema';

@Schema()
export class SourceFiles {
  @Prop({ required: true, unique: true })
  path: string;

  @Prop({ required: true })
  content: string;
}

export const SourceFilesSchema = SchemaFactory.createForClass(SourceFiles);

@Schema()
export class StrategyRevision {
  @Prop({ type: [SourceFilesSchema], required: true })
  files: SourceFiles[];

  @Prop({ default: Date.now })
  created_date?: Date;
}

export const StrategyRevisionSchema = SchemaFactory.createForClass(
  StrategyRevision,
);

export type StrategyDocument = Strategy & Document;

@Schema()
export class Strategy {
  _id?: MongooseTypes.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: MongooseTypes.ObjectId | User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  language: string;

  @Prop({ type: [StrategyRevisionSchema], required: true })
  revisions: StrategyRevision[];
}

export const StrategySchema = SchemaFactory.createForClass(Strategy);
