export class UpdateStrategyResponseFilesDTO {
  path: string;

  content: string;
}

export class UpdateStrategyResponseDTO {
  _id: string;

  user: string;

  name: string;

  language: string;

  files: UpdateStrategyResponseFilesDTO[];

  updated_date: Date;

  created_date: Date;
}
