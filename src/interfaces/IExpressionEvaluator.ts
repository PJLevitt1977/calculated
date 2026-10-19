import type { Expression } from "../models/Expression.js";
import type { ExpressionTree } from "../models/ExpressionTree.js";

export interface IExpressionEvaluator<TCalc, TExpr> {
  validate(
    tree: ExpressionTree,
    expressionTable: Map<string, Expression<TExpr>>,
    calcCtx: TCalc,
    exprCtx: TExpr
  ): string;
  evaluateTree(
    tree: ExpressionTree,
    expressionTable: Map<string, Expression<TExpr>>,
    calcCtx: TCalc,
    exprCtx: TExpr
  ): number;
  evaluateExpression(
    expression: Expression<TExpr>,
    expressionTable: Map<string, Expression<TExpr>>,
    calcCtx: TCalc
  ): void;
}
