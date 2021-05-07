import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateLanguageBodyDTO } from './dto/create-language-body.dto';
import { GetLanguageParamsDTO } from './dto/get-language-params.dto';
import { UpdateLanguageBodyDTO } from './dto/update-language-body.dto';
import { UpdateLanguageParamsDTO } from './dto/update-language-params.dto';
import { LanguagesService } from './languages.service';

@Controller('languages')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @Get()
  async getLanguages() {
    return await this.languagesService.getLanguages().select(['_id', 'name']);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLanguage(@Body() body: CreateLanguageBodyDTO) {
    const language = await this.languagesService.createLanguage(body);

    return language.toObject({ versionKey: false });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':language_id')
  async updateLanguage(
    @Param() params: UpdateLanguageParamsDTO,
    @Body() body: UpdateLanguageBodyDTO,
  ) {
    const language = await this.languagesService.updateLanguage(
      params.language_id,
      body,
    );

    if (!language) {
      throw new NotFoundException("This language doesn't exists");
    }

    return language.toObject({ versionKey: false });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':language_id')
  async getLanguage(@Param() params: GetLanguageParamsDTO) {
    const language = await this.languagesService.getLanguageById(
      params.language_id,
    );

    if (!language) {
      throw new NotFoundException("This language doesn't exists");
    }

    return language.toObject({ versionKey: false });
  }
}
