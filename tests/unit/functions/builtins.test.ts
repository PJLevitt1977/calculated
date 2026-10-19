import { describe, expect, it } from "vitest";
import { MaximumFunction } from "../../../src/functions/builtins/MaximumFunction.js";
import { MinimumFunction } from "../../../src/functions/builtins/MinimumFunction.js";
import { RoundDownFunction } from "../../../src/functions/builtins/RoundDownFunction.js";
import { RoundUpFunction } from "../../../src/functions/builtins/RoundUpFunction.js";

const ctx = {};
type Ctx = typeof ctx;

describe("MaximumFunction", () => {
  const fn = new MaximumFunction<Ctx, Ctx>();

  it("returns the larger value", () => {
    expect(fn.evaluate(ctx, ctx, [1, 5])).toBe(5);
  });

  it("returns first when equal", () => {
    expect(fn.evaluate(ctx, ctx, [3, 3])).toBe(3);
  });

  it("has name MAX", () => {
    expect(fn.name).toBe("MAX");
  });
});

describe("MinimumFunction", () => {
  const fn = new MinimumFunction<Ctx, Ctx>();

  it("returns the smaller value", () => {
    expect(fn.evaluate(ctx, ctx, [1, 5])).toBe(1);
  });

  it("has name MIN", () => {
    expect(fn.name).toBe("MIN");
  });
});

describe("RoundDownFunction", () => {
  const fn = new RoundDownFunction<Ctx, Ctx>();

  it("rounds down to factor", () => {
    expect(fn.evaluate(ctx, ctx, [1.678, 0.01])).toBeCloseTo(1.67, 10);
  });

  it("returns value unchanged when already on factor boundary", () => {
    expect(fn.evaluate(ctx, ctx, [1.5, 0.5])).toBe(1.5);
  });

  it("returns value unchanged when factor is 0", () => {
    expect(fn.evaluate(ctx, ctx, [3.14, 0])).toBe(3.14);
  });

  it("handles negative values", () => {
    expect(fn.evaluate(ctx, ctx, [-1.3, 1])).toBe(-2);
  });

  it("has name ROUNDDOWN", () => {
    expect(fn.name).toBe("ROUNDDOWN");
  });
});

describe("RoundUpFunction", () => {
  const fn = new RoundUpFunction<Ctx, Ctx>();

  it("rounds up to factor", () => {
    expect(fn.evaluate(ctx, ctx, [1.671, 0.01])).toBeCloseTo(1.68, 10);
  });

  it("returns value unchanged when already on factor boundary", () => {
    expect(fn.evaluate(ctx, ctx, [2.0, 0.5])).toBe(2.0);
  });

  it("returns value unchanged when factor is 0", () => {
    expect(fn.evaluate(ctx, ctx, [3.14, 0])).toBe(3.14);
  });

  it("has name ROUNDUP", () => {
    expect(fn.name).toBe("ROUNDUP");
  });
});
