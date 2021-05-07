import { IsMongoId } from 'class-validator';

export class GetLanguageParamsDTO {
  @IsMongoId()
  language_id: string;
}
