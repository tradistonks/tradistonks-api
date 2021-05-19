import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { QualityGrammarService } from 'src/quality/interfaces/quality-grammar-service.abstract';
import { Quality } from 'src/quality/interfaces/quality';

import { GoLexer } from './runtime/GoLexer';
import { GoParser } from './runtime/GoParser';

import { GoRuleImplem } from './rules/go-rule';
import { GoFuncnameRule } from './rules/funcname.go-rule';

export class GoQualityGrammarService extends QualityGrammarService {
  private quality = new Quality();

  private readonly rules: GoRuleImplem[] = [
    GoFuncnameRule
  ];

  run(source: string): Quality {
    const inputStream = CharStreams.fromString(source);
    const lexer = new GoLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new GoParser(tokenStream);
    const context = parser.sourceFile();

    this.rules
      .map(Rule => new Rule())
      .map(rule => rule.visit(context))
      .forEach(errors => {
        this.quality.errors.push(...errors);
      });

    return this.quality;
  }

}
