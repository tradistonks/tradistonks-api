import { Injectable, NotImplementedException } from '@nestjs/common';
import { GoVisitor } from './grammars/go/visitor';
import { GrammarVisitor } from './interfaces/grammar-visitor.interface';

@Injectable()
export class QualityService {
  private static readonly LANGUAGES_MAP: Record<string, GrammarVisitor> = {
    go: new GoVisitor(),
  };

  public run(source: string, language: string) {
    const visitor = QualityService.LANGUAGES_MAP[language.toLowerCase()];

    if (!visitor) {
      throw new NotImplementedException(
        `Language quality process for '${language}' has not been implemented yet`,
      );
    }

    return visitor.run(source);
  }
}
