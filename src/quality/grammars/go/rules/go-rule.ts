import { Rule } from 'src/quality/interfaces/rule';

import { GoParserVisitor } from '../runtime/GoParserVisitor';

export interface GoRule extends Rule {
  type: keyof GoParserVisitor<unknown>;
}
