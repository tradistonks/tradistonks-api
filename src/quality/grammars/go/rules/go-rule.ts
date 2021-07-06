import { RuleContext } from 'antlr4ts';

import { Rule } from 'src/quality/utils/rule';
import { GoParserVisitor } from '../runtime/GoParserVisitor';

export interface GoRule extends Rule {
  hooks: {
    type: keyof GoParserVisitor<unknown>;
    test: (context: RuleContext) => string[] | void;
  }[];
}
