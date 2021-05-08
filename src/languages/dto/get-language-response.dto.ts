export class GetLanguageResponseFilesDTO {
  path: string;

  content: string;
}

export class GetLanguageResponseDTO {
  _id: string;

  name: string;

  monaco_identifier: string;

  compile_script: string;

  run_script: string;

  files: GetLanguageResponseFilesDTO[];
}
