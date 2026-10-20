import { describe, expect, it } from "vitest";
import { createCalculator } from "../../src/index.js";

const calc = createCalculator();

describe("Calculator.performCalculation", () => {
  it("evaluates a simple addition", () => {
    const result = calc.performCalculation({ a: "2+3" }, {});
    expect(result["a"]).toBe(5);
  });

  it("respects operator precedence", () => {
    const result = calc.performCalculation({ A: "2+3*4" }, {});
    expect(result["A"]).toBe(14);
  });

  it("evaluates unary minus", () => {
    const result = calc.performCalculation({ A: "-1*2" }, {});
    expect(result["A"]).toBe(-2);
  });

  it("evaluates MAX", () => {
    const result = calc.performCalculation({ A: "MAX(1,2)" }, {});
    expect(result["A"]).toBe(2);
  });

  it("evaluates MIN", () => {
    const result = calc.performCalculation({ A: "MIN(3,1)" }, {});
    expect(result["A"]).toBe(1);
  });

  it("evaluates ROUNDDOWN (factor is the unit, not decimal places)", () => {
    const result = calc.performCalculation({ A: "ROUNDDOWN(7.777,1)" }, {});
    expect(result["A"]).toBe(7);
  });

  it("evaluates ROUNDUP", () => {
    const result = calc.performCalculation({ A: "ROUNDUP(7.711,0.1)" }, {});
    expect(result["A"]).toBeCloseTo(7.8, 10);
  });

  it("evaluates cross-expression reference", () => {
    const result = calc.performCalculation({ A: "2+3", B: "A*2" }, {});
    expect(result["B"]).toBe(10);
  });

  it("evaluates nested brackets", () => {
    const result = calc.performCalculation({ A: "(2+3)*4" }, {});
    expect(result["A"]).toBe(20);
  });

  it("evaluates a literal decimal", () => {
    const result = calc.performCalculation({ A: "3.14" }, {});
    expect(result["A"]).toBeCloseTo(3.14);
  });

  it("evaluates multiple expressions in one batch", () => {
    const result = calc.performCalculation(
      { X: "10", Y: "X+5", Z: "Y*2" },
      {}
    );
    expect(result["X"]).toBe(10);
    expect(result["Y"]).toBe(15);
    expect(result["Z"]).toBe(30);
  });

  it("evaluates division", () => {
    const result = calc.performCalculation({ A: "10/2" }, {});
    expect(result["A"]).toBe(5);
  });
});

describe("Calculator.isValidExpression", () => {
  it("returns true for valid expressions", () => {
    expect(calc.isValidExpression({ A: "2+3" })).toBe(true);
  });

  it("returns false and sets lastErrorMessage for invalid expression", () => {
    const valid = calc.isValidExpression({ A: "notanumber" });
    expect(valid).toBe(false);
    expect(calc.lastErrorMessage).toBeTruthy();
  });
});
