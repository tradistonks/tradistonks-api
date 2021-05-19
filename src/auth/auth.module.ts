import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalOAuth2CodeStrategy } from './strategies/local-oauth2-code.strategy';

@Module({
  providers: [AuthService, LocalOAuth2CodeStrategy],
  exports: [AuthService],
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
