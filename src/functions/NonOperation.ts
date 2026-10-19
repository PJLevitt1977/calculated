import { NonOperationException } from "../exceptions/NonOperationException.js";
import type { ICalculatorFunction } from "../interfaces/ICalculatorFunction.js";
import type { IParser } from "../interfaces/IParser.js";
import { BaseFunction } from "./BaseFunction.js";

export class NonOperation<TCalc, TExpr>
  extends BaseFunction<TCalc, TExpr>
  implements ICalculatorFunction<TCalc, TExpr>
{
  name: string;
  displayName: string;
  readonly parser: IParser<TCalc, TExpr>;

  constructor(name: string, parser: IParser<TCalc, TExpr>) {
    super();
    this.name = name;
    this.displayName = name;
    this.parser = parser;
  }

  get priority(): number {
    return 0;
  }

  evaluate(_calcCtx: TCalc, _exprCtx: TExpr, _params: number[]): number {
    throw new NonOperationException(this.name);
  }
}
