import { RuleContext } from 'antlr4ts';

export interface Rule<T> {
  errorMessage: string;
  hooks: {
    type: T;
    test: (context: RuleContext) => string[] | void;
  }[];
}
