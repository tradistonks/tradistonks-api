import { RuleContext } from 'antlr4ts';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';

import { Quality } from './quality';
import { Rule } from './rule';

export abstract class QualityGrammarVisitor
  extends AbstractParseTreeVisitor<void>
  implements ParseTreeVisitor<void>
{
  protected quality = new Quality();
  protected readonly rules: Rule[] = [];

  protected setup() {
    this.getRuleTypes().forEach((type) => {
      const rules = this.getRulesByType(type);
      this[type] = (context: RuleContext) => {
        rules.forEach((rule) => {
          rule.hooks.forEach((r) => {
            const errors = r.test(context);
            if (!!errors) {
              this.addError(rule, ...errors);
            }
          });
        });
        this.visitChildren(context);
      };
    });
  }

  public abstract run(source: string): Quality;

  private getRulesByType(type: string): Rule[] {
    return this.rules
      .map((r) => {
        return { ...r, hooks: r.hooks.filter((h) => h.type === type) };
      })
      .filter((r) => r.hooks.length > 0);
  }

  private getRuleTypes(): string[] {
    return [
      ...new Set(
        this.rules
          .map((r) => r.hooks.map((h) => h.type))
          .reduce((pv, cv) => {
            return pv.concat(cv);
          }, []),
      ),
    ];
  }

  private addError(rule: Rule, ...errors: string[]) {
    this.quality.errors.push(
      errors.reduce((errorMessage, current) => {
        return errorMessage.replace('{}', current);
      }, rule.errorMessage),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected defaultResult() {}
}
