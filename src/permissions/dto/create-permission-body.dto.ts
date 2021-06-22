import { IsString } from 'class-validator';

export class CreatePermissionBodyDTO {
  @IsString()
  name: string;

  @IsString()
  code: string;
}
