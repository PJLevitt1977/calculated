import type { ICalculatorFunction } from "../interfaces/ICalculatorFunction.js";
import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import { ClosingBracketParser } from "../parsers/ClosingBracketParser.js";
import { ParameterParser } from "../parsers/ParameterParser.js";
import { SymbolParser } from "../parsers/SymbolParser.js";
import { MaximumFunction } from "./builtins/MaximumFunction.js";
import { MinimumFunction } from "./builtins/MinimumFunction.js";
import { RoundDownFunction } from "./builtins/RoundDownFunction.js";
import { RoundUpFunction } from "./builtins/RoundUpFunction.js";
import { BinaryOperation } from "./BinaryOperation.js";
import { CustomFunction } from "./CustomFunction.js";
import { NonOperation } from "./NonOperation.js";
import { UnaryOperation } from "./UnaryOperation.js";

function createCoreFunctions<TCalc, TExpr>(): ICalculatorFunction<TCalc, TExpr>[] {
  return [
    new NonOperation<TCalc, TExpr>(")", new ClosingBracketParser<TCalc, TExpr>()),
    new NonOperation<TCalc, TExpr>("(", new SymbolParser<TCalc, TExpr>()),
    new NonOperation<TCalc, TExpr>(",", new ParameterParser<TCalc, TExpr>()),

    new UnaryOperation<TCalc, TExpr>("U-", "Unary Minus", 3, (a) => -a),
    new UnaryOperation<TCalc, TExpr>("U+", "Unary Plus", 3, (a) => +a),

    new BinaryOperation<TCalc, TExpr>("-", "Subtract", 1, (a, b) => a - b),
    new BinaryOperation<TCalc, TExpr>("+", "Add", 1, (a, b) => a + b),
    new BinaryOperation<TCalc, TExpr>("*", "Multiply", 2, (a, b) => a * b),
    new BinaryOperation<TCalc, TExpr>("/", "Divide", 2, (a, b) => a / b),

    new MinimumFunction<TCalc, TExpr>(),
    new MaximumFunction<TCalc, TExpr>(),
    new RoundUpFunction<TCalc, TExpr>(),
    new RoundDownFunction<TCalc, TExpr>(),
  ];
}

export class FunctionLibrary<TCalc, TExpr>
  implements IFunctionLibrary<TCalc, TExpr>
{
  private readonly _map: Map<string, ICalculatorFunction<TCalc, TExpr>>;
  private readonly _coreFunctionKeys: Set<string>;

  constructor(customFunctions: ICalculatorFunction<TCalc, TExpr>[] = []) {
    const coreFns = createCoreFunctions<TCalc, TExpr>();
    this._coreFunctionKeys = new Set(coreFns.map((f) => f.name.toUpperCase()));

    this._map = new Map();
    for (const fn of [...coreFns, ...customFunctions]) {
      const key = fn.name.toUpperCase();
      if (this._map.has(key))
        throw new Error(
          `Function '${fn.name}' already exists in the Function Library`
        );
      this._map.set(key, fn);
    }
  }

  function(name: string): ICalculatorFunction<TCalc, TExpr> {
    const fn = this._map.get(name.toUpperCase());
    if (!fn) throw new Error(`Function '${name}' not found in library`);
    return fn;
  }

  priority(name: string): number {
    if (!this.isFunction(name)) return -1;
    return this.function(name).priority;
  }

  isFunction(name: string): boolean {
    return this._map.has(name.toUpperCase());
  }

  isCoreFunction(name: string): boolean {
    return this._coreFunctionKeys.has(name.toUpperCase());
  }

  getFunctionSignature(name: string): string {
    if (!this.isFunction(name))
      throw new Error(`Invalid Function Name '${name}'`);
    return this.function(name).signature;
  }

  get functions(): string[] {
    return Array.from(this._map.values())
      .filter(
        (f) =>
          !(f instanceof NonOperation) &&
          !(f instanceof BinaryOperation) &&
          !(f instanceof UnaryOperation)
      )
      .map((f) => f.name);
  }
}

export function createFunctionLibrary<TCalc, TExpr>(
  customFunctions: CustomFunction<TCalc, TExpr>[] = []
): FunctionLibrary<TCalc, TExpr> {
  return new FunctionLibrary<TCalc, TExpr>(customFunctions);
}
