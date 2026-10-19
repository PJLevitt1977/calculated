import type { ICalculatorFunction } from "../interfaces/ICalculatorFunction.js";
import type { IParser } from "../interfaces/IParser.js";
import { SymbolParser } from "../parsers/SymbolParser.js";
import { BaseFunction } from "./BaseFunction.js";

export abstract class CustomFunction<TCalc, TExpr>
  extends BaseFunction<TCalc, TExpr>
  implements ICalculatorFunction<TCalc, TExpr>
{
  get priority(): number {
    return 4;
  }

  get parser(): IParser<TCalc, TExpr> {
    return new SymbolParser<TCalc, TExpr>();
  }

  abstract evaluate(calcCtx: TCalc, exprCtx: TExpr, params: number[]): number;
}
