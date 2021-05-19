import { Rule } from 'src/quality/interfaces/rule.abstract';
import { GoParserVisitor } from '../runtime/GoParserVisitor';

export abstract class GoRule extends Rule implements GoParserVisitor<string[]> {}

export interface GoRuleImplem {
  new(): GoRule;
}
