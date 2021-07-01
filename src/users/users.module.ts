import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { RolesModule } from 'src/roles/roles.module';
import { SchemasModule } from 'src/schemas/schemas.module';
import { StrategiesModule } from 'src/strategies/strategies.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [
    SchemasModule,
    StrategiesModule,
    RolesModule,
    PermissionsModule,
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
