import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LanguagesModule } from './languages/languages.module';
import { QualityModule } from './quality/quality.module';
import { RedisModule } from './redis/redis.module';
import { RunnerModule } from './runner/runner.module';
import { SchemasModule } from './schemas/schemas.module';
import { SessionMiddleware } from './session/session.middleware';
import { StrategiesModule } from './strategies/strategies.module';
import { UsersModule } from './users/users.module';
import { StocksModule } from './stocks/stocks.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsGuard } from './users/guards/permissions.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useCreateIndex: true,
    }),
    SchemasModule,
    RedisModule,
    AuthModule,
    UsersModule,
    StrategiesModule,
    RunnerModule,
    LanguagesModule,
    QualityModule,
    StocksModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
