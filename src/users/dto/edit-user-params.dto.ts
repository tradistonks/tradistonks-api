import { IsMongoId } from 'class-validator';

export class EditUserParamsDTO {
  @IsMongoId()
  id: string;
}
