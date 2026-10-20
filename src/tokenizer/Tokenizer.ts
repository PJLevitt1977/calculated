import { TokenCasing } from "../enums.js";
import type { ITokenizer } from "../interfaces/ITokenizer.js";

const OPERATOR_TOKENS = ["+", "-", "/", "*", "(", ")", ",", "="];

export class Tokenizer implements ITokenizer {
  tokenCasing: TokenCasing = TokenCasing.None;

  tokenize(expression: string): string[] {
    let expr = expression.replace(/ /g, "");
    for (const token of OPERATOR_TOKENS) {
      expr = expr.split(token).join(` ${token} `);
    }
    expr = this.applyCasing(expr);
    return expr.split(" ").filter((t) => t.length > 0);
  }

  isASign(symbol: string, index: number, tokens: string[]): boolean {
    const prev = index === 0 ? "" : (tokens[index - 1] ?? "");
    return (
      (OPERATOR_TOKENS.includes(prev) || prev === "") &&
      prev !== ")" &&
      (symbol === "+" || symbol === "-")
    );
  }

  private applyCasing(expression: string): string {
    switch (this.tokenCasing) {
      case TokenCasing.UPPER:
        return expression.toUpperCase();
      case TokenCasing.lower:
        return expression.toLowerCase();
      default:
        return expression;
    }
  }
}
