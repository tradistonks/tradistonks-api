import { IsEmail, IsString } from 'class-validator';

export class LoginBodyDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  login_challenge: string;
}
