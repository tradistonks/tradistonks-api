import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from './language.schema';
import { Permission, PermissionSchema } from './permission.schema';
import { Role, RoleSchema } from './role.schema';
import { Strategy, StrategySchema } from './strategy.schema';
import { User, UserSchema } from './user.schema';

export const SchemasModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Strategy.name, schema: StrategySchema },
  { name: Language.name, schema: LanguageSchema },
  { name: Permission.name, schema: PermissionSchema },
  { name: Role.name, schema: RoleSchema },
]);
