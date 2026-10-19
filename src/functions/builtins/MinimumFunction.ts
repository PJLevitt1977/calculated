import { CustomFunction } from "../CustomFunction.js";

export class MinimumFunction<TCalc, TExpr> extends CustomFunction<TCalc, TExpr> {
  get name(): string { return "MIN"; }
  set name(_: string) {}
  get displayName(): string { return "Minimum"; }
  set displayName(_: string) {}

  override get noOfChildren(): number { return 2; }
  override get parameterNames(): string[] { return ["Value", "Minimum"]; }

  override evaluate(_calcCtx: TCalc, _exprCtx: TExpr, params: number[]): number {
    return (params[0]! < params[1]!) ? params[0]! : params[1]!;
  }
}
