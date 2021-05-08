export class GetStrategyResponseFilesDTO {
  path: string;

  content: string;
}

export class GetStrategyResponseDTO {
  _id: string;

  user: string;

  name: string;

  language: string;

  files: GetStrategyResponseFilesDTO[];

  updated_date: Date;

  created_date: Date;
}
