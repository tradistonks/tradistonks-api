import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { Quality } from 'src/quality/utils/quality';
import { QualityGrammarVisitor } from 'src/quality/utils/quality-grammar.visitor';

import { GoLexer } from './runtime/GoLexer';
import { GoParser } from './runtime/GoParser';
import { GoParserVisitor } from './runtime/GoParserVisitor';

import { GoRule, GO_RULES } from './rules';

export class GoQualityGrammarVisitor
  extends QualityGrammarVisitor
  implements GoParserVisitor<void> {
  protected readonly rules: GoRule[] = GO_RULES;

  run(source: string): Quality {
    const inputStream = CharStreams.fromString(source);
    const lexer = new GoLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new GoParser(tokenStream);
    const context = parser.sourceFile();

    this.setup();
    this.visit(context);

    return this.quality;
  }
}
