import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SchemasModule } from 'src/schemas/schemas.module';
import { UsersModule } from 'src/users/users.module';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';

@Module({
  providers: [LanguagesService],
  exports: [LanguagesService],
  controllers: [LanguagesController],
  imports: [
    SchemasModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
})
export class LanguagesModule {}
