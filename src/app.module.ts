import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LanguagesModule } from './languages/languages.module';
import { QualityModule } from './quality/quality.module';
import { RedisModule } from './redis/redis.module';
import { RunnerModule } from './runner/runner.module';
import { SchemasModule } from './schemas/schemas.module';
import { SessionModule } from './session/session.module';
import { StrategiesModule } from './strategies/strategies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useCreateIndex: true,
    }),
    SchemasModule,
    SessionModule,
    RedisModule,
    AuthModule,
    UsersModule,
    StrategiesModule,
    RunnerModule,
    LanguagesModule,
    QualityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
