import { RuleContext } from 'antlr4ts';

export interface Rule {
  errorMessage: string;
  hooks: {
    type: string;
    test: (context: RuleContext) => string[] | void;
  }[];
}
