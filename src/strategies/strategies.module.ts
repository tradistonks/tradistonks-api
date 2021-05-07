import { Module } from '@nestjs/common';
import { LanguagesModule } from 'src/languages/languages.module';
import { RunnerModule } from 'src/runner/runner.module';
import { SchemasModule } from 'src/schemas/schemas.module';
import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';
import { IsExistingLanguageIdConstraint } from './validators/is-existing-language-id.validator';

@Module({
  controllers: [StrategiesController],
  providers: [StrategiesService, IsExistingLanguageIdConstraint],
  exports: [StrategiesService],
  imports: [SchemasModule, LanguagesModule, RunnerModule],
})
export class StrategiesModule {}
