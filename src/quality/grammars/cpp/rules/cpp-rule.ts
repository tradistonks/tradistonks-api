import { RuleContext } from 'antlr4ts';

import { Rule } from 'src/quality/utils/rule';
import { CPP14ParserVisitor } from '../runtime/CPP14ParserVisitor';

export interface CppRule extends Rule {
  hooks: {
    type: keyof CPP14ParserVisitor<unknown>;
    test: (context: RuleContext) => string[] | void;
  }[];
}
