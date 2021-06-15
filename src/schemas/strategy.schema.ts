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

export type StrategySymbolsCandlesGranularity =
  | '1'
  | '5'
  | '15'
  | '30'
  | '60'
  | 'D'
  | 'W'
  | 'M';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StrategySymbolsCandlesGranularity {
  export function toSeconds(granularity: StrategySymbolsCandlesGranularity) {
    switch (granularity) {
      case '1':
        return 60;
      case '5':
        return 300;
      case '15':
        return 900;
      case '30':
        return 1800;
      case '60':
        return 3600;
      case 'D':
        return 86400;
      case 'W':
        return 604800;
      case 'M':
        return 2678400;
    }
  }
}

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

  @Prop({ type: String, required: true })
  symbols_candles_granularity: StrategySymbolsCandlesGranularity;

  @Prop({ required: true })
  from: Date;

  @Prop()
  to?: Date;

  @Prop({ default: Date.now })
  updated_date: Date;

  @Prop({ default: Date.now })
  created_date: Date;
}

export const StrategySchema = SchemaFactory.createForClass(Strategy);
