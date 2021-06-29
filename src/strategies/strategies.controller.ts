import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  InternalServerErrorException,
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
import { RunnerFailedError, RunnerService } from 'src/runner/runner.service';
import { StrategySymbolsCandlesGranularity } from 'src/schemas/strategy.schema';
import { User } from 'src/schemas/user.schema';
import { objectIdsToStrings } from 'src/schemas/utils/object-ids-to-strings.interface';
import { StocksService, SymbolCandlesResult } from 'src/stocks/stocks.service';
import { CreateStrategyBodyDTO } from './dto/create-strategy-body.dto';
import { CreateStrategyResponseDTO } from './dto/create-strategy-response.dto';
import { GetStrategyParamsDTO } from './dto/get-strategy-params.dto';
import { GetStrategyResponseDTO } from './dto/get-strategy-response.dto';
import { QualityStrategyParamsDTO } from './dto/quality-strategy-params.dto';
import { QualityStrategyResponseItemDTO } from './dto/quality-strategy-response.dto';
import { RunStrategyParamsDTO } from './dto/run-strategy-params.dto';
import {
  RunStrategyResponseDTO,
  RunStrategyResponseDTOHistoryCandle,
  RunStrategyResponseDTOOrder,
} from './dto/run-strategy-response.dto';
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
    private stocksService: StocksService,
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

    interface SymbolData {
      name: string;
      ticker: string;
      type: string;

      candles: SymbolCandlesResult;
    }

    const now = new Date();

    const symbolsDataPromises = strategy.symbols.map(async (symbol) => {
      return <SymbolData>{
        name: symbol.name,
        ticker: symbol.ticker,
        type: symbol.type,

        candles: await this.stocksService.getCandles(
          symbol.ticker,
          symbol.type,
          strategy.from,
          strategy.to ?? now,
          strategy.symbols_candles_granularity,
        ),
      };
    });

    const symbolsDataArray = await Promise.all(symbolsDataPromises);

    const config = {
      timestamp_start: Math.min(
        ...symbolsDataArray.map((symbol) => symbol.candles.timestamp[0]),
      ),
      timestamp_end: Math.max(
        ...symbolsDataArray.map(
          (symbol) =>
            symbol.candles.timestamp[symbol.candles.timestamp.length - 1],
        ),
      ),
      granularity: StrategySymbolsCandlesGranularity.toSeconds(
        strategy.symbols_candles_granularity,
      ),
    };

    const positions: Record<string, number> = {};
    for (const symbol of symbolsDataArray) {
      positions[symbol.ticker] = 0;
    }

    const timestamps: number[] = [];
    const history: Record<
      number,
      Record<string, RunStrategyResponseDTOHistoryCandle>
    > = {};

    for (
      let timestamp = config.timestamp_start;
      timestamp < config.timestamp_end;
      timestamp += config.granularity
    ) {
      timestamps.push(timestamp);
      history[timestamp] = {};

      for (const symbol of symbolsDataArray) {
        const position = positions[symbol.ticker];
        const candles = symbol.candles;

        if (candles.timestamp[position] === timestamp) {
          history[timestamp][symbol.ticker] = {
            open: candles.open[position],
            high: candles.high[position],
            low: candles.low[position],
            close: candles.close[position],
            volume: candles.volume[position],
            timestamp: candles.timestamp[position],
          };

          positions[symbol.ticker]++;
        } else if (timestamp !== config.timestamp_start) {
          // Copy the previous ticker value
          history[timestamp][symbol.ticker] =
            history[timestamp - config.granularity][symbol.ticker];
        }
      }
    }

    try {
      const { phases } = await this.runnerService.run({
        files: [
          ...strategy.files,
          ...language.files,
          { path: '/.symbols-data', content: JSON.stringify(history) },
          {
            path: '/.symbols-data-config',
            content: JSON.stringify(config),
          },
        ],
        compileScript: language.compile_script,
        runScript: language.run_script,
      });

      if (phases.length < 3) {
        return { phases };
      }

      const lastPhase = phases.pop();

      if (lastPhase.status !== 0) {
        return { phases };
      }

      const orders: RunStrategyResponseDTOOrder[] = JSON.parse(
        lastPhase.stdout,
      );

      const pnl = this.strategiesService.calculatePnl(
        timestamps,
        history,
        orders,
      );

      return {
        phases,
        orders,
        history,
        config,
        pnl,
      };
    } catch (e) {
      if (e instanceof RunnerFailedError) {
        throw new HttpException(e.toJson(), e.status);
      }

      console.error(e);
      throw new InternalServerErrorException();
    }
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
