import { TokenCasing } from "../enums.js";
import type { IExpressionParser } from "../interfaces/IExpressionParser.js";
import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import type { ITokeniser } from "../interfaces/ITokeniser.js";
import { ExpressionTree } from "../models/ExpressionTree.js";
import { createTreeNode } from "./BaseParser.js";
import { ValueParser } from "./ValueParser.js";

export class ExpressionParser<TCalc, TExpr>
  implements IExpressionParser<TCalc, TExpr>
{
  private readonly _tokeniser: ITokeniser;
  private readonly _functions: IFunctionLibrary<TCalc, TExpr>;
  private readonly _valueParser: ValueParser<TCalc, TExpr>;

  constructor(
    tokeniser: ITokeniser,
    functions: IFunctionLibrary<TCalc, TExpr>
  ) {
    this._tokeniser = tokeniser;
    this._tokeniser.tokenCasing = TokenCasing.UPPER;
    this._functions = functions;
    this._valueParser = new ValueParser();
  }

  get functions(): IFunctionLibrary<TCalc, TExpr> {
    return this._functions;
  }

  parse(expression: string): ExpressionTree {
    const tokens = this._tokeniser.tokenise(expression);
    if (tokens.length === 0) return new ExpressionTree("");

    const values: ExpressionTree[] = [];
    const operators: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]!;

      if (
        (token === "+" || token === "-") &&
        this._tokeniser.isASign(token, i, tokens)
      ) {
        const unaryOp = `U${token}`;
        this._functions
          .function(unaryOp)
          .parser.parse(unaryOp, values, operators, this._functions);
      } else if (this._functions.isFunction(token)) {
        this._functions
          .function(token)
          .parser.parse(token, values, operators, this._functions);
      } else {
        this._valueParser.parse(token, values, operators, this._functions);
      }
    }

    while (operators.length > 0) {
      const op = operators.pop()!;
      values.push(createTreeNode(op, values, this._functions));
    }

    const result = values.pop();
    if (result === undefined) throw new Error("Expression produced no result.");
    return result;
  }
}
