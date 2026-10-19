import type { ExpressionTree } from "../models/ExpressionTree.js";
import type { IFunctionLibrary } from "./IFunctionLibrary.js";

export interface IExpressionParser<TCalc, TExpr> {
  readonly functions: IFunctionLibrary<TCalc, TExpr>;
  parse(expression: string): ExpressionTree;
}
