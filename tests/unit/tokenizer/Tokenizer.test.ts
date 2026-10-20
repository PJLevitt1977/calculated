import { describe, expect, it } from "vitest";
import { TokenCasing } from "../../../src/enums.js";
import { Tokenizer } from "../../../src/tokenizer/Tokenizer.js";

describe("Tokenizer.tokenize", () => {
  it("splits basic arithmetic", () => {
    const t = new Tokenizer();
    expect(t.tokenize("2+3")).toEqual(["2", "+", "3"]);
  });

  it("strips spaces", () => {
    const t = new Tokenizer();
    expect(t.tokenize("2 + 3")).toEqual(["2", "+", "3"]);
  });

  it("handles function calls", () => {
    const t = new Tokenizer();
    expect(t.tokenize("MAX(1,2)")).toEqual(["MAX", "(", "1", ",", "2", ")"]);
  });

  it("handles subtraction and multiplication", () => {
    const t = new Tokenizer();
    expect(t.tokenize("4*3-2")).toEqual(["4", "*", "3", "-", "2"]);
  });

  it("returns empty array for empty string", () => {
    const t = new Tokenizer();
    expect(t.tokenize("")).toEqual([]);
  });

  it("handles unary minus at start", () => {
    const t = new Tokenizer();
    expect(t.tokenize("-1")).toEqual(["-", "1"]);
  });

  it("applies UPPER casing", () => {
    const t = new Tokenizer();
    t.tokenCasing = TokenCasing.UPPER;
    expect(t.tokenize("max(a,b)")).toEqual(["MAX", "(", "A", ",", "B", ")"]);
  });

  it("applies lower casing", () => {
    const t = new Tokenizer();
    t.tokenCasing = TokenCasing.lower;
    expect(t.tokenize("MAX(A,B)")).toEqual(["max", "(", "a", ",", "b", ")"]);
  });
});

describe("Tokenizer.isASign", () => {
  it("returns true for minus at index 0", () => {
    const t = new Tokenizer();
    expect(t.isASign("-", 0, ["-", "1"])).toBe(true);
  });

  it("returns false for minus after a number", () => {
    const t = new Tokenizer();
    expect(t.isASign("-", 1, ["2", "-", "3"])).toBe(false);
  });

  it("returns true for minus after open bracket", () => {
    const t = new Tokenizer();
    expect(t.isASign("-", 1, ["(", "-", "1"])).toBe(true);
  });

  it("returns false for minus after closing bracket", () => {
    const t = new Tokenizer();
    expect(t.isASign("-", 1, [")", "-", "1"])).toBe(false);
  });

  it("returns true for plus at index 0", () => {
    const t = new Tokenizer();
    expect(t.isASign("+", 0, ["+", "1"])).toBe(true);
  });

  it("returns false for non-sign operators", () => {
    const t = new Tokenizer();
    expect(t.isASign("*", 0, ["*", "1"])).toBe(false);
  });
});
