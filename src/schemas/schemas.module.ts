import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from './language.schema';
import { Strategy, StrategySchema } from './strategy.schema';
import { User, UserSchema } from './user.schema';

export const SchemasModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Strategy.name, schema: StrategySchema },
  { name: Language.name, schema: LanguageSchema },
]);
