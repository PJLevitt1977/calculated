import { RoundDownFunction } from "./RoundDownFunction.js";

export class RoundUpFunction<TCalc, TExpr> extends RoundDownFunction<TCalc, TExpr> {
  override get name(): string { return "ROUNDUP"; }
  override set name(_: string) {}
  override get displayName(): string { return "Round Up"; }
  override set displayName(_: string) {}

  override evaluate(calcCtx: TCalc, exprCtx: TExpr, params: number[]): number {
    const value = params[0]!;
    const factor = params[1]!;
    if (factor === 0) return value;
    if (value % factor === 0) return value;

    const roundedDown = super.evaluate(calcCtx, exprCtx, params);
    return roundedDown + factor;
  }
}
