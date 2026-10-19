import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import type { ExpressionTree } from "../models/ExpressionTree.js";
import { BaseParser } from "./BaseParser.js";

export class SymbolParser<TCalc, TExpr> extends BaseParser<TCalc, TExpr> {
  override parse(
    token: string,
    _outputStack: ExpressionTree[],
    operatorStack: string[],
    _library: IFunctionLibrary<TCalc, TExpr>
  ): void {
    operatorStack.push(token);
  }
}
