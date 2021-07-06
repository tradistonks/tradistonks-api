import { GoRule } from './go-rule';

import {
  ConstDeclContext,
  ShortVarDeclContext,
  TypeDeclContext,
  VarDeclContext,
} from '../runtime/GoParser';

export const goVarnameRule: GoRule = {
  errorMessage:
    'Invalid variable name `{}`. Variable names must be in camel case.',
  hooks: [
    {
      type: 'visitConstDecl',
      test: (context: ConstDeclContext) => {
        for (const ctx of context.constSpec()) {
          const invalidVar = ctx
            .identifierList()
            .IDENTIFIER()
            .find((i) => !/^[a-zA-Z][a-zA-Z0-9]*$/.test(i.text));
          if (!!invalidVar) {
            return [invalidVar.text];
          }
        }
      },
    },
    {
      type: 'visitTypeDecl',
      test: (context: TypeDeclContext) => {
        for (const ctx of context.typeSpec()) {
          const name = ctx.IDENTIFIER().text;
          if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
            return [name];
          }
        }
      },
    },
    {
      type: 'visitShortVarDecl',
      test: (context: ShortVarDeclContext) => {
        for (const identifier of context.identifierList().IDENTIFIER()) {
          if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(identifier.text)) {
            return [identifier.text];
          }
        }
      },
    },
    {
      type: 'visitVarDecl',
      test: (context: VarDeclContext) => {
        for (const ctx of context.varSpec()) {
          const invalidVar = ctx
            .identifierList()
            .IDENTIFIER()
            .find((i) => !/^[a-zA-Z][a-zA-Z0-9]*$/.test(i.text));
          if (!!invalidVar) {
            return [invalidVar.text];
          }
        }
      },
    },
  ],
};
