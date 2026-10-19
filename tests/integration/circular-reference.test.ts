import { describe, expect, it } from "vitest";
import { CircularReferenceException } from "../../src/exceptions/CircularReferenceException.js";
import { createCalculator } from "../../src/index.js";

describe("Circular reference detection", () => {
  it("throws CircularReferenceException for direct self-reference", () => {
    const calc = createCalculator();
    expect(() => calc.performCalculation({ A: "A" }, {})).toThrow(
      CircularReferenceException
    );
  });

  it("throws CircularReferenceException for indirect cycle", () => {
    const calc = createCalculator();
    expect(() => calc.performCalculation({ A: "B", B: "A" }, {})).toThrow(
      CircularReferenceException
    );
  });
});
