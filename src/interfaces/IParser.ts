import type { ExpressionTree } from "../models/ExpressionTree.js";
import type { IFunctionLibrary } from "./IFunctionLibrary.js";

export interface IParser<TCalc, TExpr> {
  parse(
    token: string,
    outputStack: ExpressionTree[],
    operatorStack: string[],
    library: IFunctionLibrary<TCalc, TExpr>
  ): void;
}
