import type { TokenCasing } from "../enums.js";

export interface ITokeniser {
  tokenCasing: TokenCasing;
  tokenise(expression: string): string[];
  isASign(symbol: string, index: number, tokens: string[]): boolean;
}
