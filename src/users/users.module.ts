import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { StrategiesModule } from 'src/strategies/strategies.module';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [
    SchemasModule,
    StrategiesModule,
    PermissionsModule,
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
