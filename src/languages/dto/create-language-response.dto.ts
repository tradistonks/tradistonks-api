export class CreateLanguageResponseFilesDTO {
  path: string;

  content: string;
}

export class CreateLanguageResponseDTO {
  _id: string;

  name: string;

  monaco_identifier: string;

  compile_script: string;

  run_script: string;

  files: CreateLanguageResponseFilesDTO[];
}
