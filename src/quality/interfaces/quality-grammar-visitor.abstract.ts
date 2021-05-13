import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { Quality } from './quality.interface';

export abstract class QualityGrammarVisitor extends AbstractParseTreeVisitor<void> {
  public abstract run(source: string): Quality;
}

export interface QualityGrammarVisitorConstructor {
  new (): QualityGrammarVisitor;
}
