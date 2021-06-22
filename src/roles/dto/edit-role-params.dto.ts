import { IsMongoId } from 'class-validator';

export class EditRoleParamsDTO {
  @IsMongoId()
  id: string;
}
