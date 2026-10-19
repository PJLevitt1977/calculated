import { describe, expect, it } from "vitest";
import { TokenCasing } from "../../../src/enums.js";
import { Tokeniser } from "../../../src/tokeniser/Tokeniser.js";

describe("Tokeniser.tokenise", () => {
  it("splits basic arithmetic", () => {
    const t = new Tokeniser();
    expect(t.tokenise("2+3")).toEqual(["2", "+", "3"]);
  });

  it("strips spaces", () => {
    const t = new Tokeniser();
    expect(t.tokenise("2 + 3")).toEqual(["2", "+", "3"]);
  });

  it("handles function calls", () => {
    const t = new Tokeniser();
    expect(t.tokenise("MAX(1,2)")).toEqual(["MAX", "(", "1", ",", "2", ")"]);
  });

  it("handles subtraction and multiplication", () => {
    const t = new Tokeniser();
    expect(t.tokenise("4*3-2")).toEqual(["4", "*", "3", "-", "2"]);
  });

  it("returns empty array for empty string", () => {
    const t = new Tokeniser();
    expect(t.tokenise("")).toEqual([]);
  });

  it("handles unary minus at start", () => {
    const t = new Tokeniser();
    expect(t.tokenise("-1")).toEqual(["-", "1"]);
  });

  it("applies UPPER casing", () => {
    const t = new Tokeniser();
    t.tokenCasing = TokenCasing.UPPER;
    expect(t.tokenise("max(a,b)")).toEqual(["MAX", "(", "A", ",", "B", ")"]);
  });

  it("applies lower casing", () => {
    const t = new Tokeniser();
    t.tokenCasing = TokenCasing.lower;
    expect(t.tokenise("MAX(A,B)")).toEqual(["max", "(", "a", ",", "b", ")"]);
  });
});

describe("Tokeniser.isASign", () => {
  it("returns true for minus at index 0", () => {
    const t = new Tokeniser();
    expect(t.isASign("-", 0, ["-", "1"])).toBe(true);
  });

  it("returns false for minus after a number", () => {
    const t = new Tokeniser();
    expect(t.isASign("-", 1, ["2", "-", "3"])).toBe(false);
  });

  it("returns true for minus after open bracket", () => {
    const t = new Tokeniser();
    expect(t.isASign("-", 1, ["(", "-", "1"])).toBe(true);
  });

  it("returns false for minus after closing bracket", () => {
    const t = new Tokeniser();
    expect(t.isASign("-", 1, [")", "-", "1"])).toBe(false);
  });

  it("returns true for plus at index 0", () => {
    const t = new Tokeniser();
    expect(t.isASign("+", 0, ["+", "1"])).toBe(true);
  });

  it("returns false for non-sign operators", () => {
    const t = new Tokeniser();
    expect(t.isASign("*", 0, ["*", "1"])).toBe(false);
  });
});
