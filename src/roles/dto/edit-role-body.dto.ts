import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditRoleBodyDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  permissions?: string[];
}
