import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StrategiesModule } from './strategies/strategies.module';
import { SchemasModule } from './schemas/schemas.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useCreateIndex: true,
    }),
    AuthModule,
    UsersModule,
    StrategiesModule,
    SchemasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
