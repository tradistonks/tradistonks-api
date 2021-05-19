import { IsString } from 'class-validator';

export class LocalCallbackQueriesDTO {
  @IsString()
  code: string;

  @IsString()
  state: string;
}
