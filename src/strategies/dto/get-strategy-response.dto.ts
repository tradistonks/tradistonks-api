export class GetStrategyResponseFilesDTO {
  path: string;

  content: string;
}

export class GetStrategyResponseSymbolDTO {
  name: string;

  ticker: string;

  type: string;
}

export class GetStrategyResponseDTO {
  _id: string;

  user: string;

  name: string;

  language: string;

  files: GetStrategyResponseFilesDTO[];

  symbols: GetStrategyResponseSymbolDTO[];

  updated_date: Date;

  created_date: Date;
}
