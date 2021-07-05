import { CppRule } from './cpp-rule';

import { FunctionDefinitionContext } from '../runtime/CPP14Parser';

export const cppFuncnameRule: CppRule = {
  errorMessage:
    'Invalid function name `{}`. Function names must be in snake case.',
  hooks: [
    {
      type: 'visitFunctionDefinition',
      test: (context: FunctionDefinitionContext) => {
        return [];
        const name = context.declarator();
        console.log(name.text);
        if (!/^[a-z][a-z_]*$/.test(name.text)) {
          return [name.text];
        }
      },
    },
  ],
};
