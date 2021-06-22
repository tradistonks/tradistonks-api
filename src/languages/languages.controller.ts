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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permissions } from 'src/users/guards/decorators/permissions.decorator';
import { CreateLanguageBodyDTO } from './dto/create-language-body.dto';
import { CreateLanguageResponseDTO } from './dto/create-language-response.dto';
import { GetLanguageParamsDTO } from './dto/get-language-params.dto';
import { GetLanguageResponseDTO } from './dto/get-language-response.dto';
import { GetLanguagesResponseDTO } from './dto/get-languages-response.dto';
import { UpdateLanguageBodyDTO } from './dto/update-language-body.dto';
import { UpdateLanguageParamsDTO } from './dto/update-language-params.dto';
import { UpdateLanguageResponseDTO } from './dto/update-language-response.dto';
import { LanguagesService } from './languages.service';

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getLanguages(): Promise<GetLanguagesResponseDTO> {
    const languages = await this.languagesService
      .getLanguages()
      .select(['_id', 'name'])
      .lean();

    return languages;
  }

  @ApiBearerAuth()
  @Post()
  @Permissions(['manage-languages'])
  async createLanguage(
    @Body() body: CreateLanguageBodyDTO,
  ): Promise<CreateLanguageResponseDTO> {
    const language = await this.languagesService.createLanguage(body);

    return language.toObject({ versionKey: false });
  }

  @ApiBearerAuth()
  @Put(':language_id')
  @Permissions(['manage-languages'])
  async updateLanguage(
    @Param() params: UpdateLanguageParamsDTO,
    @Body() body: UpdateLanguageBodyDTO,
  ): Promise<UpdateLanguageResponseDTO> {
    const language = await this.languagesService.updateLanguage(
      params.language_id,
      body,
    );

    if (!language) {
      throw new NotFoundException("This language doesn't exists");
    }

    return language.toObject({ versionKey: false });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':language_id')
  async getLanguage(
    @Param() params: GetLanguageParamsDTO,
  ): Promise<GetLanguageResponseDTO> {
    const language = await this.languagesService.getLanguageById(
      params.language_id,
    );

    if (!language) {
      throw new NotFoundException("This language doesn't exists");
    }

    return language.toObject({ versionKey: false });
  }
}
