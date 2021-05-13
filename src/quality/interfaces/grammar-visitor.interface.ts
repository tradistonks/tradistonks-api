import { Quality } from './quality.interface';

export interface GrammarVisitor {
  run(source: string): Quality;
}
