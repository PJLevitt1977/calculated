import { describe, expect, it } from "vitest";
import { FunctionLibrary } from "../../../src/functions/FunctionLibrary.js";
import { CustomFunction } from "../../../src/functions/CustomFunction.js";
import { NonOperationException } from "../../../src/exceptions/NonOperationException.js";

describe("FunctionLibrary", () => {
  it("recognises built-in operators as core functions", () => {
    const lib = new FunctionLibrary();
    expect(lib.isCoreFunction("+")).toBe(true);
    expect(lib.isCoreFunction("-")).toBe(true);
    expect(lib.isCoreFunction("*")).toBe(true);
    expect(lib.isCoreFunction("/")).toBe(true);
    expect(lib.isCoreFunction("(")).toBe(true);
    expect(lib.isCoreFunction(")")).toBe(true);
    expect(lib.isCoreFunction(",")).toBe(true);
  });

  it("recognises built-in functions as both functions and core (matching C# design)", () => {
    const lib = new FunctionLibrary();
    expect(lib.isFunction("MAX")).toBe(true);
    expect(lib.isCoreFunction("MAX")).toBe(true);
    expect(lib.isFunction("MIN")).toBe(true);
    expect(lib.isFunction("ROUNDUP")).toBe(true);
    expect(lib.isFunction("ROUNDDOWN")).toBe(true);
  });

  it("returns false for unknown function names", () => {
    const lib = new FunctionLibrary();
    expect(lib.isFunction("UNKNOWN")).toBe(false);
  });

  it("returns priority for operators", () => {
    const lib = new FunctionLibrary();
    expect(lib.priority("+")).toBe(1);
    expect(lib.priority("-")).toBe(1);
    expect(lib.priority("*")).toBe(2);
    expect(lib.priority("/")).toBe(2);
  });

  it("returns -1 priority for unknown function", () => {
    const lib = new FunctionLibrary();
    expect(lib.priority("UNKNOWN")).toBe(-1);
  });

  it("accepts custom functions via constructor", () => {
    class MyFn extends CustomFunction<unknown, unknown> {
      name = "MYFN";
      displayName = "My Function";
      override get noOfChildren() { return 1; }
      override evaluate(_c: unknown, _e: unknown, params: number[]) {
        return (params[0] ?? 0) * 10;
      }
    }
    const lib = new FunctionLibrary([new MyFn()]);
    expect(lib.isFunction("MYFN")).toBe(true);
    expect(lib.isFunction("myfn")).toBe(true);
  });

  it("throws on duplicate function name", () => {
    class DupFn extends CustomFunction<unknown, unknown> {
      name = "MAX";
      displayName = "Dup";
      override evaluate() { return 0; }
    }
    expect(() => new FunctionLibrary([new DupFn()])).toThrow();
  });

  it("lists visible functions (excludes operators and non-ops)", () => {
    const lib = new FunctionLibrary();
    const fns = lib.functions;
    expect(fns).toContain("MAX");
    expect(fns).toContain("MIN");
    expect(fns).not.toContain("+");
    expect(fns).not.toContain("(");
  });

  it("throws NonOperationException when evaluating a NonOperation", () => {
    const lib = new FunctionLibrary();
    const fn = lib.function("(");
    expect(() => fn.evaluate({} as never, {} as never, [])).toThrow(
      NonOperationException
    );
  });
});
