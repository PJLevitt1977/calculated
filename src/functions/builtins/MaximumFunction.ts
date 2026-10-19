import { CustomFunction } from "../CustomFunction.js";

export class MaximumFunction<TCalc, TExpr> extends CustomFunction<TCalc, TExpr> {
  get name(): string { return "MAX"; }
  set name(_: string) {}
  get displayName(): string { return "Maximum"; }
  set displayName(_: string) {}

  override get noOfChildren(): number { return 2; }
  override get parameterNames(): string[] { return ["Value", "Maximum"]; }

  override evaluate(_calcCtx: TCalc, _exprCtx: TExpr, params: number[]): number {
    return (params[0]! > params[1]!) ? params[0]! : params[1]!;
  }
}
