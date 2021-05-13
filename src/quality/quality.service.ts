import { Injectable, NotImplementedException } from '@nestjs/common';
import { GoQualityVisitor } from './grammars/go/go-quality.visitor';
import { QualityGrammarVisitorConstructor } from './interfaces/quality-grammar-visitor.abstract';

@Injectable()
export class QualityService {
  private static readonly LANGUAGES_MAP: Record<
    string,
    QualityGrammarVisitorConstructor
  > = {
    go: GoQualityVisitor,
  };

  public run(source: string, language: string) {
    const QualityVisitor = QualityService.LANGUAGES_MAP[language.toLowerCase()];

    if (!QualityVisitor) {
      throw new NotImplementedException(
        `Language quality process for '${language}' has not been implemented yet`,
      );
    }

    const visitor = new QualityVisitor();
    return visitor.run(source);
  }
}
