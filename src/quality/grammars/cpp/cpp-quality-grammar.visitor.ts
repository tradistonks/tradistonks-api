import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { QualityGrammarVisitor } from 'src/quality/utils/quality-grammar.visitor';

import { CPP14Lexer } from './runtime/CPP14Lexer';
import { CPP14Parser } from './runtime/CPP14Parser';
import { CPP14ParserVisitor } from './runtime/CPP14ParserVisitor';

import { CppRule, CPP_RULES } from './rules';

export class CPPQualityGrammarVisitor
  extends QualityGrammarVisitor
  implements CPP14ParserVisitor<void>
{
  protected readonly rules: CppRule[] = CPP_RULES;

  run(source: string): any {
    const inputStream = CharStreams.fromString(source);
    const lexer = new CPP14Lexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new CPP14Parser(tokenStream);
    const context = parser.translationUnit();

    this.setup();
    this.visit(context);

    return this.quality;
  }
}
