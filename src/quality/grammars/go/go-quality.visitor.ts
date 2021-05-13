import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { QualityGrammarVisitor } from 'src/quality/interfaces/quality-grammar-visitor.abstract';
import { Quality } from 'src/quality/interfaces/quality.interface';
import { GoLexer } from './runtime/GoLexer';
import { FunctionDeclContext, GoParser } from './runtime/GoParser';
import { GoParserVisitor } from './runtime/GoParserVisitor';

export class GoQualityVisitor
  extends QualityGrammarVisitor
  implements GoParserVisitor<void> {
  private quality: Quality;

  run(source: string): Quality {
    const inputStream = CharStreams.fromString(source);
    const lexer = new GoLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new GoParser(tokenStream);

    this.quality = {
      score: 100,
    };

    const context = parser.sourceFile();
    this.visit(context);

    return this.quality;
  }

  visitFunctionDecl(context: FunctionDeclContext): void {
    const name = context.IDENTIFIER().text;

    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
      this.quality.score -= 5;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected defaultResult() {}
}
