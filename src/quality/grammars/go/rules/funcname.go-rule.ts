import { GoRule } from './go-rule';

import { FunctionDeclContext } from '../runtime/GoParser';

export class GoFuncnameRule extends GoRule {

  errorMessage = 'Invalid function name `{}`. Function names must be in camel case.';

  visitFunctionDecl(context: FunctionDeclContext): string[] {
    const name = context.IDENTIFIER().text;

    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
      this.addError(name);
    }

    return this.errors;
  }

}
