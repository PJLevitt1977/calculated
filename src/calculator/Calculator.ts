import { ExpressionState } from "../enums.js";
import type { ICalculator } from "../interfaces/ICalculator.js";
import type { IExpressionEvaluator } from "../interfaces/IExpressionEvaluator.js";
import type { IExpressionParser } from "../interfaces/IExpressionParser.js";
import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import { Expression } from "../models/Expression.js";

export class Calculator<TCalc, TExpr> implements ICalculator<TCalc, TExpr> {
  private readonly _parser: IExpressionParser<TCalc, TExpr>;
  private readonly _evaluator: IExpressionEvaluator<TCalc, TExpr>;
  lastErrorMessage: string | null = null;

  constructor(
    parser: IExpressionParser<TCalc, TExpr>,
    evaluator: IExpressionEvaluator<TCalc, TExpr>
  ) {
    this._parser = parser;
    this._evaluator = evaluator;
  }

  get functions(): IFunctionLibrary<TCalc, TExpr> {
    return this._parser.functions;
  }

  isValidExpression(expressions: Record<string, string>): boolean {
    const table = this.buildExpressionTable(expressions);
    const defaultCtx = {} as TCalc;
    const defaultExprCtx = {} as TExpr;

    for (const [, rawExpr] of Object.entries(expressions)) {
      const tree = this._parser.parse(rawExpr);
      this.lastErrorMessage = this._evaluator.validate(
        tree,
        table,
        defaultCtx,
        defaultExprCtx
      );
      if (this.lastErrorMessage) return false;
    }
    return true;
  }

  performCalculation(
    expressions: Record<string, string>,
    context: TCalc
  ): Record<string, number> {
    const table = this.buildExpressionTable(expressions);

    for (const expr of table.values()) {
      if (expr.status !== ExpressionState.Calculated) {
        expr.status = ExpressionState.NotCalculated;
        expr.expressionTree = this._parser.parse(expr.calculation);
        expr.value = 0;
      }
    }

    for (const expr of table.values()) {
      this._evaluator.evaluateExpression(expr, table, context);
    }

    const result: Record<string, number> = {};
    for (const [name, expr] of table) {
      result[name] = expr.value;
    }
    return result;
  }

  private buildExpressionTable(
    expressions: Record<string, string>
  ): Map<string, Expression<TExpr>> {
    const table = new Map<string, Expression<TExpr>>();
    for (const [name, calculation] of Object.entries(expressions)) {
      const expr = new Expression<TExpr>(name, calculation);
      expr.expressionTree = this._parser.parse(calculation);
      table.set(name, expr);
    }
    return table;
  }
}
