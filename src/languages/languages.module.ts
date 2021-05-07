import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';

@Module({
  providers: [LanguagesService],
  exports: [LanguagesService],
  controllers: [LanguagesController],
  imports: [SchemasModule],
})
export class LanguagesModule {}
