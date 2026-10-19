import type { ICalculatorFunction } from "../interfaces/ICalculatorFunction.js";
import type { IParser } from "../interfaces/IParser.js";
import { UnaryOperationParser } from "../parsers/UnaryOperationParser.js";
import { UnaryOperationException } from "../exceptions/UnaryOperationException.js";
import { BaseFunction } from "./BaseFunction.js";

export class UnaryOperation<TCalc, TExpr>
  extends BaseFunction<TCalc, TExpr>
  implements ICalculatorFunction<TCalc, TExpr>
{
  name: string;
  displayName: string;
  priority: number;
  readonly evaluator: (a: number) => number;

  constructor(
    name: string,
    displayName: string,
    priority: number,
    evaluator: (a: number) => number
  ) {
    super();
    this.name = name;
    this.displayName = displayName;
    this.priority = priority;
    this.evaluator = evaluator;
  }

  override get noOfChildren(): number {
    return 1;
  }

  override get signature(): string {
    return `${this.name.slice(1)} {0}`;
  }

  get parser(): IParser<TCalc, TExpr> {
    return new UnaryOperationParser<TCalc, TExpr>();
  }

  evaluate(_calcCtx: TCalc, _exprCtx: TExpr, params: number[]): number {
    if (params.length !== 1) return 0;
    try {
      return this.evaluator(params[0]!);
    } catch (err) {
      throw new UnaryOperationException(
        this.name,
        String(params[0]),
        "Check that the operand is a valid number."
      );
    }
  }
}
