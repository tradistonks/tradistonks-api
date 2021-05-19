import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';

export abstract class Rule extends AbstractParseTreeVisitor<string[]> {
  private _errors: string[] = [];
  errorMessage = '';

  get errors(): string[] {
    return this._errors.map(e => this.errorMessage.replace('{}', e));
  }

  addError(error: string) {
    this._errors.push(error);
  }

  protected defaultResult() {
    return this.errors;
  }
}
