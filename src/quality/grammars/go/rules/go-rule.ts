import { Rule } from 'src/quality/utils/rule';

import { GoParserVisitor } from '../runtime/GoParserVisitor';

export interface GoRule extends Rule {
  type: keyof GoParserVisitor<unknown>;
}
