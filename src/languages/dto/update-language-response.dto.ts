export class UpdateLanguageResponseFilesDTO {
  path: string;

  content: string;
}

export class UpdateLanguageResponseDTO {
  _id: string;

  name: string;

  monaco_identifier: string;

  compile_script: string;

  run_script: string;

  files: UpdateLanguageResponseFilesDTO[];
}
