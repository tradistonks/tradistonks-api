import { IsMongoId } from 'class-validator';

export class DeletePermissionParamsDTO {
  @IsMongoId()
  id: string;
}
