import {
  IsEmail,
  IsMongoId,
  IsNotIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditUserBodyDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @IsNotIn(['me'])
  username?: string;

  @IsOptional()
  @IsMongoId({ each: true })
  roles?: string;
}
