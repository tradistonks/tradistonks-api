import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LanguagesModule } from 'src/languages/languages.module';
import { QualityModule } from 'src/quality/quality.module';
import { RunnerModule } from 'src/runner/runner.module';
import { SchemasModule } from 'src/schemas/schemas.module';
import { UsersModule } from 'src/users/users.module';
import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';
import { IsExistingLanguageIdConstraint } from './validators/is-existing-language-id.validator';

@Module({
  controllers: [StrategiesController],
  providers: [StrategiesService, IsExistingLanguageIdConstraint],
  exports: [StrategiesService],
  imports: [
    SchemasModule,
    LanguagesModule,
    RunnerModule,
    QualityModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
})
export class StrategiesModule {}
