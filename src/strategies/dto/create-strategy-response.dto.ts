export class CreateStrategyResponseFilesDTO {
  path: string;

  content: string;
}

export class CreateStrategyResponseSymbolDTO {
  name: string;

  ticker: string;

  type: string;
}

export class CreateStrategyResponseDTO {
  _id: string;

  user: string;

  name: string;

  language: string;

  files: CreateStrategyResponseFilesDTO[];

  symbols: CreateStrategyResponseSymbolDTO[];

  symbols_candles_granularity: string;

  updated_date: Date;

  created_date: Date;
}
