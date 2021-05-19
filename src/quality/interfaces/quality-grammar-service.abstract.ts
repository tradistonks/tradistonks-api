import { Quality } from './quality';

export abstract class QualityGrammarService {
  public abstract run(source: string): Quality;
}

export interface QualityGrammarServiceConstructor {
  new (): QualityGrammarService;
}
