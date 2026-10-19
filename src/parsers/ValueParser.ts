import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import { ExpressionTree } from "../models/ExpressionTree.js";
import { BaseParser } from "./BaseParser.js";

export class ValueParser<TCalc, TExpr> extends BaseParser<TCalc, TExpr> {
  override parse(
    token: string,
    outputStack: ExpressionTree[],
    _operatorStack: string[],
    _library: IFunctionLibrary<TCalc, TExpr>
  ): void {
    outputStack.push(new ExpressionTree(token, 0));
  }
}
