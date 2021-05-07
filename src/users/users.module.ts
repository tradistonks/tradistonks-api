import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { StrategiesModule } from 'src/strategies/strategies.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [SchemasModule, StrategiesModule],
})
export class UsersModule {}
