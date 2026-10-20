export { TokenCasing, ExpressionState } from "./enums.js";

export type { ICalculator } from "./interfaces/ICalculator.js";
export type { ICalculatorFunction } from "./interfaces/ICalculatorFunction.js";
export type { IExpressionEvaluator } from "./interfaces/IExpressionEvaluator.js";
export type { IExpressionParser } from "./interfaces/IExpressionParser.js";
export type { IFunctionLibrary } from "./interfaces/IFunctionLibrary.js";
export type { IParser } from "./interfaces/IParser.js";
export type { ITokenizer } from "./interfaces/ITokenizer.js";

export { Expression } from "./models/Expression.js";
export { ExpressionTree } from "./models/ExpressionTree.js";

export {
  FunctionException,
  BinaryOperationException,
  UnaryOperationException,
  NonOperationException,
  CircularReferenceException,
  InvalidExpressionValueException,
} from "./exceptions/index.js";

export { Tokenizer } from "./tokenizer/Tokenizer.js";
export {
  ExpressionParser,
  BaseParser,
  ValueParser,
  BinaryOperationParser,
  UnaryOperationParser,
  SymbolParser,
  ParameterParser,
  ClosingBracketParser,
} from "./parsers/index.js";

export {
  CustomFunction,
  FunctionLibrary,
  createFunctionLibrary,
  BaseFunction,
  BinaryOperation,
  UnaryOperation,
  NonOperation,
  MaximumFunction,
  MinimumFunction,
  RoundDownFunction,
  RoundUpFunction,
} from "./functions/index.js";

export { ExpressionEvaluator } from "./evaluators/ExpressionEvaluator.js";
export { Calculator } from "./calculator/Calculator.js";

import { Calculator } from "./calculator/Calculator.js";
import { ExpressionEvaluator } from "./evaluators/ExpressionEvaluator.js";
import type { ICalculator } from "./interfaces/ICalculator.js";
import { ExpressionParser } from "./parsers/ExpressionParser.js";
import { CustomFunction } from "./functions/CustomFunction.js";
import { FunctionLibrary } from "./functions/FunctionLibrary.js";
import { Tokenizer } from "./tokenizer/Tokenizer.js";

export function createCalculator<TCalc, TExpr>(
  customFunctions: CustomFunction<TCalc, TExpr>[] = []
): ICalculator<TCalc, TExpr> {
  const library = new FunctionLibrary<TCalc, TExpr>(customFunctions);
  const tokenizer = new Tokenizer();
  const parser = new ExpressionParser<TCalc, TExpr>(tokenizer, library);
  const evaluator = new ExpressionEvaluator<TCalc, TExpr>(library);
  return new Calculator<TCalc, TExpr>(parser, evaluator);
}
