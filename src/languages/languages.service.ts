import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types as MongooseTypes } from 'mongoose';
import { Language, LanguageDocument } from 'src/schemas/language.schema';
import { CreateLanguageBodyDTO } from './dto/create-language-body.dto';
import { UpdateLanguageBodyDTO } from './dto/update-language-body.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
  ) {}

  getLanguages() {
    return this.languageModel.find();
  }

  getLanguageById(id: string | MongooseTypes.ObjectId) {
    return this.languageModel.findById(id);
  }

  async existsLanguageById(id: string | MongooseTypes.ObjectId) {
    return await this.languageModel.exists({ _id: id });
  }

  createLanguage(data: CreateLanguageBodyDTO) {
    return this.languageModel.create(data);
  }

  async updateLanguage(
    id: string | MongooseTypes.ObjectId,
    data: UpdateLanguageBodyDTO,
  ) {
    const language = await this.languageModel.findById(id);

    if (!language) {
      return null;
    }

    return await language.set(data).save();
  }
}
