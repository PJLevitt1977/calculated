import { describe, expect, it } from "vitest";
import { CustomFunction } from "../../src/functions/CustomFunction.js";
import { createCalculator } from "../../src/index.js";

class DoubleFunction extends CustomFunction<unknown, unknown> {
  name = "DOUBLE";
  displayName = "Double";
  override get noOfChildren() { return 1; }
  override evaluate(_c: unknown, _e: unknown, params: number[]): number {
    return (params[0] ?? 0) * 2;
  }
}

describe("Custom function injection", () => {
  it("can register and call a custom function", () => {
    const calc = createCalculator([new DoubleFunction()]);
    const result = calc.performCalculation({ A: "DOUBLE(5)" }, {});
    expect(result["A"]).toBe(10);
  });

  it("custom function appears in library functions list", () => {
    const calc = createCalculator([new DoubleFunction()]);
    expect(calc.functions.isFunction("DOUBLE")).toBe(true);
    expect(calc.functions.functions).toContain("DOUBLE");
  });
});
