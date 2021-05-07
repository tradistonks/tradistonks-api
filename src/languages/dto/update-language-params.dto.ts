import { IsMongoId } from 'class-validator';

export class UpdateLanguageParamsDTO {
  @IsMongoId()
  language_id: string;
}
