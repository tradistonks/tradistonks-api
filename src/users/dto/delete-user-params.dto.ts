import { IsMongoId } from 'class-validator';

export class DeleteUserParamsDTO {
  @IsMongoId()
  id: string;
}
