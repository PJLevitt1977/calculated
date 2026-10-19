import type { IFunctionLibrary } from "./IFunctionLibrary.js";

export interface ICalculator<TCalc, TExpr> {
  readonly functions: IFunctionLibrary<TCalc, TExpr>;
  lastErrorMessage: string | null;
  isValidExpression(expressions: Record<string, string>): boolean;
  performCalculation(
    expressions: Record<string, string>,
    context: TCalc
  ): Record<string, number>;
}
