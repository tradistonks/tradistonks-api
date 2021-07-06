import { GoRule } from './go-rule';

import { ForStmtContext } from '../runtime/GoParser';

export const goTooManyLoopsRule: GoRule = {
  errorMessage: 'Too many for loops imbrications.',
  hooks: [
    {
      type: 'visitForStmt',
      test: (context: ForStmtContext) => {
        let count = 0;
        let currentContext = context;
        while (!!currentContext) {
          currentContext = currentContext
            .block()
            .statementList()
            .statement()
            .find((s) => !!s.forStmt())
            ?.forStmt();
          count++;
        }
        if (count >= 3) {
          return [];
        }
      },
    },
  ],
};
