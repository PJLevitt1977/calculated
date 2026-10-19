import { CustomFunction } from "../CustomFunction.js";

export class RoundDownFunction<TCalc, TExpr> extends CustomFunction<TCalc, TExpr> {
  get name(): string { return "ROUNDDOWN"; }
  set name(_: string) {}
  get displayName(): string { return "Round Down"; }
  set displayName(_: string) {}

  override get noOfChildren(): number { return 2; }
  override get parameterNames(): string[] { return ["Value", "Factor"]; }

  override evaluate(_calcCtx: TCalc, _exprCtx: TExpr, params: number[]): number {
    const value = params[0]!;
    const factor = params[1]!;
    if (factor === 0) return value;
    if (value % factor === 0) return value;

    let multiplier = Math.trunc(value / factor);
    if (value < 0) multiplier--;
    return multiplier * factor;
  }
}
