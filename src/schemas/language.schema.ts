import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MongooseTypes } from 'mongoose';
import { SourceFiles } from './strategy.schema';

export type LanguageDocument = Language & Document;

@Schema()
export class Language {
  _id?: MongooseTypes.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  monaco_identifier: string;

  @Prop()
  compile_script: string;

  @Prop({ required: true })
  run_script: string;

  @Prop({ required: true })
  files: SourceFiles[];
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
