import { IsString } from 'class-validator';

export class ConsentBodyDTO {
  @IsString()
  consent_challenge: string;
}
