import { BinaryOperationException } from "../exceptions/BinaryOperationException.js";
import type { ICalculatorFunction } from "../interfaces/ICalculatorFunction.js";
import type { IParser } from "../interfaces/IParser.js";
import { BinaryOperationParser } from "../parsers/BinaryOperationParser.js";
import { BaseFunction } from "./BaseFunction.js";

export class BinaryOperation<TCalc, TExpr>
  extends BaseFunction<TCalc, TExpr>
  implements ICalculatorFunction<TCalc, TExpr>
{
  name: string;
  displayName: string;
  priority: number;
  readonly evaluator: (a: number, b: number) => number;

  constructor(
    name: string,
    displayName: string,
    priority: number,
    evaluator: (a: number, b: number) => number
  ) {
    super();
    this.name = name;
    this.displayName = displayName;
    this.priority = priority;
    this.evaluator = evaluator;
  }

  override get noOfChildren(): number {
    return 2;
  }

  override get signature(): string {
    return `{0} ${this.name} {1}`;
  }

  get parser(): IParser<TCalc, TExpr> {
    return new BinaryOperationParser<TCalc, TExpr>();
  }

  evaluate(_calcCtx: TCalc, _exprCtx: TExpr, params: number[]): number {
    if (params.length !== 2) return 0;
    try {
      return this.evaluator(params[0]!, params[1]!);
    } catch (err) {
      throw new BinaryOperationException(
        this.name,
        String(params[0]),
        String(params[1]),
        "Check that both operands are valid numbers and the operation is defined."
      );
    }
  }
}
