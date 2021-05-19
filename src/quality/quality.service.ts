import { Injectable, NotImplementedException } from '@nestjs/common';

import { QualityGrammarServiceConstructor } from './interfaces/quality-grammar-service.abstract';

import { GoQualityGrammarService } from './grammars/go/go-quality-grammar.service';

@Injectable()
export class QualityService {
  private static readonly LANGUAGES_MAP: Record<
    string,
    QualityGrammarServiceConstructor
  > = {
    go: GoQualityGrammarService,
  };

  public run(source: string, language: string) {
    const QualityGrammarService = QualityService.LANGUAGES_MAP[language.toLowerCase()];

    if (!QualityGrammarService) {
      throw new NotImplementedException(
        `Language quality process for '${language}' has not been implemented yet`,
      );
    }

    const visitor = new QualityGrammarService();
    return visitor.run(source);
  }
}
