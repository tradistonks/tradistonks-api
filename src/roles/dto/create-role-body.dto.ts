import { IsArray, IsMongoId, IsString } from 'class-validator';

export class CreateRoleBodyDTO {
  @IsString()
  name: string;

  @IsArray()
  @IsMongoId({ each: true })
  permissions: string[];
}
