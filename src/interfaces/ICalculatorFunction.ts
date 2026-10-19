import type { IParser } from "./IParser.js";

export interface ICalculatorFunction<TCalc, TExpr> {
  readonly name: string;
  readonly displayName: string;
  readonly signature: string;
  readonly parameterNames: string[];
  readonly priority: number;
  readonly noOfChildren: number;
  readonly parser: IParser<TCalc, TExpr>;
  evaluate(calcCtx: TCalc, exprCtx: TExpr, params: number[]): number;
}
