import type { ICalculatorFunction } from "./ICalculatorFunction.js";

export interface IFunctionLibrary<TCalc, TExpr> {
  readonly functions: string[];
  function(name: string): ICalculatorFunction<TCalc, TExpr>;
  priority(name: string): number;
  isFunction(name: string): boolean;
  isCoreFunction(name: string): boolean;
  getFunctionSignature(name: string): string;
}
