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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LanguagesService } from 'src/languages/languages.service';
import { RunnerService } from 'src/runner/runner.service';
import { User } from 'src/schemas/user.schema';
import { CreateStrategyBodyDTO } from './dto/create-strategy-body.dto';
import { GetStrategyParamsDTO } from './dto/get-strategy-params.dto';
import { RunStrategyParamsDTO } from './dto/run-strategy-params.dto';
import { UpdateStrategyBodyDTO } from './dto/update-strategy-body.dto';
import { UpdateStrategyParamsDTO } from './dto/update-strategy-params.dto';
import { StrategiesService } from './strategies.service';

@ApiTags('Strategies')
@Controller('strategies')
export class StrategiesController {
  constructor(
    private strategiesService: StrategiesService,
    private languagesService: LanguagesService,
    private runnerService: RunnerService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createStrategy(
    @AuthUser() user: User,
    @Body() body: CreateStrategyBodyDTO,
  ) {
    const strategy = await this.strategiesService.createStrategy(
      user._id,
      body,
    );

    return strategy.toObject();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':strategy_id')
  async getStrategy(
    @AuthUser() user: User,
    @Param() params: GetStrategyParamsDTO,
  ) {
    const strategy = await this.strategiesService.getStrategyById(
      params.strategy_id,
    );

    if (!strategy) {
      throw new NotFoundException("This strategy doesn't exists");
    }

    if (!user._id.equals(strategy.user as MongooseTypes.ObjectId)) {
      throw new ForbiddenException("You don't have access to this strategy");
    }

    return strategy.toObject();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':strategy_id')
  async updateStrategy(
    @AuthUser() user: User,
    @Param() params: UpdateStrategyParamsDTO,
    @Body() body: UpdateStrategyBodyDTO,
  ) {
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

    return updatedStrategy.toObject();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':strategy_id/run')
  async runStrategy(
    @AuthUser() user: User,
    @Param() params: RunStrategyParamsDTO,
  ) {
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
}
