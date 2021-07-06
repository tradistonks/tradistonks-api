import { Injectable, NotImplementedException } from '@nestjs/common';

import { QualityGrammarVisitor } from './utils/quality-grammar.visitor';

import { GoQualityGrammarVisitor } from './grammars/go/go-quality-grammar.visitor';
import { CPPQualityGrammarVisitor } from './grammars/cpp/cpp-quality-grammar.visitor';

@Injectable()
export class QualityService {
  private static readonly LANGUAGES_MAP: Record<
    string,
    { new (): QualityGrammarVisitor }
  > = {
    go: GoQualityGrammarVisitor,
    'c++': CPPQualityGrammarVisitor,
  };

  public run(source: string, language: string) {
    const QualityGrammarService =
      QualityService.LANGUAGES_MAP[language.toLowerCase()];

    if (!QualityGrammarService) {
      throw new NotImplementedException(
        `Language quality process for '${language}' has not been implemented yet`,
      );
    }

    const visitor = new QualityGrammarService();
    return visitor.run(source);
  }
}
