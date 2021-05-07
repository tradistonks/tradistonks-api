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
import { Types as MongooseTypes } from 'mongoose';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/schemas/user.schema';
import { CreateStrategyBodyDTO } from './dto/create-strategy-body.dto';
import { GetStrategyParamsDTO } from './dto/get-strategy-params.dto';
import { UpdateStrategyBodyDTO } from './dto/update-strategy-body.dto';
import { UpdateStrategyParamsDTO } from './dto/update-strategy-params.dto';
import { StrategiesService } from './strategies.service';

@Controller('strategies')
export class StrategiesController {
  constructor(private strategiesService: StrategiesService) {}

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
}
