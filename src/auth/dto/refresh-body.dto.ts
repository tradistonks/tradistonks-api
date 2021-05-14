import { IsString } from 'class-validator';

export class RefreshBodyDTO {
  @IsString()
  refresh_token: string;
}
