import { GoRule } from './go-rule';
import { ExpressionContext } from '../runtime/GoParser';

export const goNoBoolConstCompRule: GoRule = {
  errorMessage: 'Omit comparison with boolean constant.',
  hooks: [
    {
      type: 'visitExpression',
      test: (context: ExpressionContext) => {
        const token = context.EQUALS();
        if (!!token) {
          const hasLitteral = context.children.some((child) =>
            ['true', 'false'].includes(child.text),
          );
          if (hasLitteral) {
            return [];
          }
        }
      },
    },
  ],
};
