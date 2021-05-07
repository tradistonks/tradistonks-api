import {
  IsEmail,
  IsNotIn,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEqualTo } from 'src/validators/is-equal-to.validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @IsNotIn(['me'])
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsEqualTo('password')
  password_confirmation: string;
}
