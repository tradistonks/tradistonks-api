import { GoRule } from './go-rule';

import { FunctionDeclContext } from '../runtime/GoParser';

export const goFuncnameRule: GoRule = {
  type: 'visitFunctionDecl',
  errorMessage:
    'Invalid function name `{}`. Function names must be in camel case.',
  test: (context: FunctionDeclContext) => {
    const name = context.IDENTIFIER().text;
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
      return [name];
    }
  },
};
