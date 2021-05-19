import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { StrategiesModule } from 'src/strategies/strategies.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [SchemasModule, StrategiesModule, forwardRef(() => AuthModule)],
})
export class UsersModule {}
