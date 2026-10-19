import { describe, expect, it } from "vitest";
import { BinaryOperationException } from "../../../src/exceptions/BinaryOperationException.js";
import { CircularReferenceException } from "../../../src/exceptions/CircularReferenceException.js";
import { FunctionException } from "../../../src/exceptions/FunctionException.js";
import { NonOperationException } from "../../../src/exceptions/NonOperationException.js";
import { UnaryOperationException } from "../../../src/exceptions/UnaryOperationException.js";
import { InvalidExpressionValueException } from "../../../src/exceptions/InvalidExpressionValueException.js";

describe("BinaryOperationException", () => {
  it("is instanceof FunctionException", () => {
    const e = new BinaryOperationException("+", "1", "2", "hint");
    expect(e).toBeInstanceOf(FunctionException);
  });

  it("includes operands in message", () => {
    const e = new BinaryOperationException("+", "1", "abc", "hint");
    expect(e.message).toContain("+");
    expect(e.message).toContain("1");
    expect(e.message).toContain("abc");
  });

  it("stores suggestion", () => {
    const e = new BinaryOperationException("+", "1", "2", "my hint");
    expect(e.suggestion).toBe("my hint");
  });
});

describe("UnaryOperationException", () => {
  it("is instanceof FunctionException", () => {
    const e = new UnaryOperationException("-", "x", "hint");
    expect(e).toBeInstanceOf(FunctionException);
  });

  it("stores suggestion", () => {
    const e = new UnaryOperationException("-", "x", "my hint");
    expect(e.suggestion).toBe("my hint");
  });
});

describe("CircularReferenceException", () => {
  it("formats cycle path in message", () => {
    const e = new CircularReferenceException(["A", "B", "A"]);
    expect(e.message).toContain("A → B → A");
  });

  it("stores the cycle path", () => {
    const e = new CircularReferenceException(["X", "Y"]);
    expect(e.cyclePath).toEqual(["X", "Y"]);
  });
});

describe("NonOperationException", () => {
  it("includes the token name in the message", () => {
    const e = new NonOperationException("(");
    expect(e.message).toContain("(");
  });
});

describe("InvalidExpressionValueException", () => {
  it("includes expression name and raw value in message", () => {
    const e = new InvalidExpressionValueException("A", "abc");
    expect(e.message).toContain("A");
    expect(e.message).toContain("abc");
  });
});
