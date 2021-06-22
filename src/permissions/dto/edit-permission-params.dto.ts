import { IsMongoId } from 'class-validator';

export class EditPermissionParamsDTO {
  @IsMongoId()
  id: string;
}
