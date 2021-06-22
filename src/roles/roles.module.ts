import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { UsersModule } from 'src/users/users.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
  imports: [SchemasModule, UsersModule],
})
export class RolesModule {}
