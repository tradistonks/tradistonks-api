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

  @Prop({ default: '' })
  content: string;
}

export const SourceFilesSchema = SchemaFactory.createForClass(SourceFiles);

@Schema()
export class StockSymbol {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ticker: string;

  @Prop({ default: '' })
  type: string;
}

export const StockSymbolSchema = SchemaFactory.createForClass(StockSymbol);

export type StrategyDocument = Strategy & Document;

@Schema()
export class Strategy {
  _id: MongooseTypes.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: MongooseTypes.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Language.name,
    required: true,
  })
  language: MongooseTypes.ObjectId;

  @Prop({ type: [SourceFilesSchema], required: true })
  files: SourceFiles[];

  @Prop({ type: [StockSymbolSchema], required: true })
  symbols: StockSymbol[];

  @Prop({ default: Date.now })
  updated_date: Date;

  @Prop({ default: Date.now })
  created_date: Date;
}

export const StrategySchema = SchemaFactory.createForClass(Strategy);
