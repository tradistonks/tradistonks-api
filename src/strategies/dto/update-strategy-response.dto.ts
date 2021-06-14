import { StrategySymbolsCandlesGranularity } from 'src/schemas/strategy.schema';

export class UpdateStrategyResponseFilesDTO {
  path: string;

  content: string;
}

export class UpdateStrategyResponseSymbolDTO {
  name: string;

  ticker: string;

  type: string;
}

export class UpdateStrategyResponseDTO {
  _id: string;

  user: string;

  name: string;

  language: string;

  files: UpdateStrategyResponseFilesDTO[];

  symbols: UpdateStrategyResponseSymbolDTO[];

  symbols_candles_granularity: StrategySymbolsCandlesGranularity;

  from: Date;

  to?: Date;

  updated_date: Date;

  created_date: Date;
}
