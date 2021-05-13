import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StrategiesModule } from './strategies/strategies.module';
import { SchemasModule } from './schemas/schemas.module';
import { RunnerModule } from './runner/runner.module';
import { LanguagesModule } from './languages/languages.module';
import { QualityModule } from './quality/quality.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useCreateIndex: true,
    }),
    AuthModule,
    UsersModule,
    StrategiesModule,
    SchemasModule,
    RunnerModule,
    LanguagesModule,
    QualityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
