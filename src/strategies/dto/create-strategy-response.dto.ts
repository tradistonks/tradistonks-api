export class CreateStrategyResponseFilesDTO {
  path: string;

  content: string;
}

export class CreateStrategyResponseDTO {
  _id: string;

  user: string;

  name: string;

  language: string;

  files: CreateStrategyResponseFilesDTO[];

  updated_date: Date;

  created_date: Date;
}
