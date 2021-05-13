import { BufferedTokenStream, Lexer, Parser } from 'antlr4ts';
import { GoLexer } from './runtime/GoLexer';

export abstract class GoParserBase extends Parser {
  /**
   * Returns {@code true} iff on the current index of the parser's
   * token stream a token exists on the {@code HIDDEN} channel which
   * either is a line terminator, or is a multi line comment that
   * contains a line terminator.
   *
   * @return {@code true} iff on the current index of the parser's
   * token stream a token exists on the {@code HIDDEN} channel which
   * either is a line terminator, or is a multi line comment that
   * contains a line terminator.
   */
  protected lineTerminatorAhead(): boolean {
    // Get the token ahead of the current index.
    let offset = 1;
    let possibleIndexEosToken = this.currentToken.tokenIndex - offset;

    if (possibleIndexEosToken == -1) {
      return true;
    }

    let ahead = this._input.get(possibleIndexEosToken);

    while (ahead.channel == Lexer.HIDDEN) {
      if (ahead.type == GoLexer.TERMINATOR) {
        return true;
      } else if (ahead.type == GoLexer.WS) {
        possibleIndexEosToken = this.currentToken.tokenIndex - ++offset;
        ahead = this._input.get(possibleIndexEosToken);
      } else if (ahead.type == GoLexer.COMMENT) {
        if (ahead.text.includes('\r') || ahead.text.includes('\n')) {
          return true;
        } else {
          possibleIndexEosToken = this.currentToken.tokenIndex - ++offset;
          ahead = this._input.get(possibleIndexEosToken);
        }
      }
    }

    return false;
  }

  /**
   * Returns {@code true} if no line terminator exists between the specified
   * token offset and the prior one on the {@code HIDDEN} channel.
   *
   * @return {@code true} if no line terminator exists between the specified
   * token offset and the prior one on the {@code HIDDEN} channel.
   */
  protected noTerminatorBetween(tokenOffset: number): boolean {
    const stream = this._input as BufferedTokenStream;
    const tokens = stream.getHiddenTokensToLeft(
      stream.LT(tokenOffset).tokenIndex,
    );

    if (tokens == null) {
      return true;
    }

    for (const token of tokens) {
      if (token.text.includes('\n')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns {@code true} if no line terminator exists after any encounterd
   * parameters beyond the specified token offset and the next on the
   * {@code HIDDEN} channel.
   *
   * @return {@code true} if no line terminator exists after any encounterd
   * parameters beyond the specified token offset and the next on the
   * {@code HIDDEN} channel.
   */
  protected noTerminatorAfterParams(tokenOffset: number): boolean {
    const stream = this._input as BufferedTokenStream;
    let leftParams = 1;
    let rightParams = 0;

    if (stream.LT(tokenOffset).type == GoLexer.L_PAREN) {
      // Scan past parameters
      while (leftParams != rightParams) {
        tokenOffset++;
        const valueType = stream.LT(tokenOffset).type;

        if (valueType == GoLexer.L_PAREN) {
          leftParams++;
        } else if (valueType == GoLexer.R_PAREN) {
          rightParams++;
        }
      }

      tokenOffset++;
      return this.noTerminatorBetween(tokenOffset);
    }

    return true;
  }

  protected checkPreviousTokenText(text: string): boolean {
    const stream = this._input as BufferedTokenStream;
    const prevTokenText = stream.LT(1).text;

    if (prevTokenText == null) return false;

    return prevTokenText === text;
  }
}
