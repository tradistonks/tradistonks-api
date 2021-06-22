import { IsOptional, IsString } from 'class-validator';

export class EditPermissionBodyDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;
}
