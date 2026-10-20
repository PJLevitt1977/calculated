import type { TokenCasing } from "../enums.js";

export interface ITokenizer {
  tokenCasing: TokenCasing;
  tokenize(expression: string): string[];
  isASign(symbol: string, index: number, tokens: string[]): boolean;
}
