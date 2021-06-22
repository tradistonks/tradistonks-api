import { IsMongoId } from 'class-validator';

export class DeleteRoleParamsDTO {
  @IsMongoId()
  id: string;
}
