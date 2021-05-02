import { IsEmail, IsString } from 'class-validator';
import { IsEqualTo } from 'src/validators/is-equal-to.validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsEqualTo('password')
  password_confirmation: string;
}
