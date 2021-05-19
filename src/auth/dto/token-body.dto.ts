import { IsString } from 'class-validator';

export class TokenBodyDTO {
  @IsString()
  code: string;
}
