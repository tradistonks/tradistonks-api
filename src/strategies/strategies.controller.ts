import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types as MongooseTypes } from 'mongoose';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { LanguagesService } from 'src/languages/languages.service';
import { QualityService } from 'src/quality/quality.service';
import { RunnerService } from 'src/runner/runner.service';
import { User } from 'src/schemas/user.schema';
import { objectIdsToStrings } from 'src/schemas/utils/object-ids-to-strings.interface';
import { CreateStrategyBodyDTO } from './dto/create-strategy-body.dto';
import { CreateStrategyResponseDTO } from './dto/create-strategy-response.dto';
import { GetStrategyParamsDTO } from './dto/get-strategy-params.dto';
import { GetStrategyResponseDTO } from './dto/get-strategy-response.dto';
import { QualityStrategyParamsDTO } from './dto/quality-strategy-params.dto';
import { QualityStrategyResponseItemDTO } from './dto/quality-strategy-response.dto';
import { RunStrategyParamsDTO } from './dto/run-strategy-params.dto';
import { RunStrategyResponseDTO } from './dto/run-strategy-response.dto';
import { UpdateStrategyBodyDTO } from './dto/update-strategy-body.dto';
import { UpdateStrategyParamsDTO } from './dto/update-strategy-params.dto';
import { UpdateStrategyResponseDTO } from './dto/update-strategy-response.dto';
import { StrategiesService } from './strategies.service';

@ApiTags('Strategies')
@Controller('strategies')
export class StrategiesController {
  constructor(
    private strategiesService: StrategiesService,
    private languagesService: LanguagesService,
    private runnerService: RunnerService,
    private qualityService: QualityService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createStrategy(
    @AuthUser() user: User,
    @Body() body: CreateStrategyBodyDTO,
  ): Promise<CreateStrategyResponseDTO> {
    const strategy = await this.strategiesService.createStrategy(
      user._id,
      body,
    );

    return objectIdsToStrings(strategy.toObject({ versionKey: false }));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':strategy_id')
  async getStrategy(
    @AuthUser() user: User,
    @Param() params: GetStrategyParamsDTO,
  ): Promise<GetStrategyResponseDTO> {
    const strategy = await this.strategiesService.getStrategyById(
      params.strategy_id,
    );

    if (!strategy) {
      throw new NotFoundException("This strategy doesn't exists");
    }

    if (!user._id.equals(strategy.user as MongooseTypes.ObjectId)) {
      throw new ForbiddenException("You don't have access to this strategy");
    }

    return objectIdsToStrings(strategy.toObject({ versionKey: false }));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':strategy_id')
  async updateStrategy(
    @AuthUser() user: User,
    @Param() params: UpdateStrategyParamsDTO,
    @Body() body: UpdateStrategyBodyDTO,
  ): Promise<UpdateStrategyResponseDTO> {
    const strategy = await this.strategiesService.getStrategyById(
      params.strategy_id,
    );

    if (!strategy) {
      throw new NotFoundException("This strategy doesn't exists");
    }

    if (!user._id.equals(strategy.user as MongooseTypes.ObjectId)) {
      throw new ForbiddenException("You don't have access to this strategy");
    }

    const updatedStrategy = await this.strategiesService.updateStrategy(
      params.strategy_id,
      body,
    );

    return objectIdsToStrings(updatedStrategy.toObject({ versionKey: false }));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':strategy_id/run')
  async runStrategy(
    @AuthUser() user: User,
    @Param() params: RunStrategyParamsDTO,
  ): Promise<RunStrategyResponseDTO> {
    const strategy = await this.strategiesService
      .getStrategyById(params.strategy_id)
      .lean();

    if (!strategy) {
      throw new NotFoundException("This strategy doesn't exists");
    }

    if (!user._id.equals(strategy.user as MongooseTypes.ObjectId)) {
      throw new ForbiddenException("You don't have access to this strategy");
    }

    const language = await this.languagesService
      .getLanguageById(strategy.language as MongooseTypes.ObjectId)
      .lean();

    if (!language) {
      throw new NotFoundException(
        "This language used in this strategy doesn't exists",
      );
    }

    return await this.runnerService.run({
      files: strategy.files,
      compileScript: language.compile_script,
      runScript: language.run_script,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':strategy_id/quality')
  async strategyQuality(
    @AuthUser() user: User,
    @Param() params: QualityStrategyParamsDTO,
  ): Promise<QualityStrategyResponseItemDTO[]> {
    const strategy = await this.strategiesService
      .getStrategyById(params.strategy_id)
      .lean();

    if (!strategy) {
      throw new NotFoundException("This strategy doesn't exists");
    }

    if (!user._id.equals(strategy.user as MongooseTypes.ObjectId)) {
      throw new ForbiddenException("You don't have access to this strategy");
    }

    const language = await this.languagesService
      .getLanguageById(strategy.language as MongooseTypes.ObjectId)
      .lean();

    if (!language) {
      throw new NotFoundException(
        "This language used in this strategy doesn't exists",
      );
    }

    return strategy.files.map((file) => {
      return {
        path: file.path,
        ...this.qualityService.run(file.content, language.name),
      };
    });
  }
}
