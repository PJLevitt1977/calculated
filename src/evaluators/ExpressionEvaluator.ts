import { ExpressionState } from "../enums.js";
import { CircularReferenceException } from "../exceptions/CircularReferenceException.js";
import { InvalidExpressionValueException } from "../exceptions/InvalidExpressionValueException.js";
import { NonOperationException } from "../exceptions/NonOperationException.js";
import type { IExpressionEvaluator } from "../interfaces/IExpressionEvaluator.js";
import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import type { Expression } from "../models/Expression.js";
import type { ExpressionTree } from "../models/ExpressionTree.js";

export class ExpressionEvaluator<TCalc, TExpr>
  implements IExpressionEvaluator<TCalc, TExpr>
{
  private readonly _functions: IFunctionLibrary<TCalc, TExpr>;

  constructor(functions: IFunctionLibrary<TCalc, TExpr>) {
    this._functions = functions;
  }

  validate(
    tree: ExpressionTree,
    expressionTable: Map<string, Expression<TExpr>>,
    calcCtx: TCalc,
    exprCtx: TExpr
  ): string {
    try {
      this.evaluateTree(tree, expressionTable, calcCtx, exprCtx);
      return "";
    } catch (err) {
      return err instanceof Error ? err.message : String(err);
    }
  }

  evaluateExpression(
    expression: Expression<TExpr>,
    expressionTable: Map<string, Expression<TExpr>>,
    calcCtx: TCalc
  ): void {
    if (expression.status === ExpressionState.Calculated) return;

    if (expression.status === ExpressionState.InProgress)
      throw new CircularReferenceException([expression.name]);

    expression.status = ExpressionState.InProgress;

    const tree = expression.expressionTree;
    if (!tree) throw new Error(`Expression '${expression.name}' has no parsed tree.`);

    expression.value = this.evaluateTree(
      tree,
      expressionTable,
      calcCtx,
      expression.context as TExpr
    );
    expression.status = ExpressionState.Calculated;
  }

  evaluateTree(
    tree: ExpressionTree,
    expressionTable: Map<string, Expression<TExpr>>,
    calcCtx: TCalc,
    exprCtx: TExpr
  ): number {
    const referenced = expressionTable.get(tree.value);
    if (referenced !== undefined) {
      this.evaluateExpression(referenced, expressionTable, calcCtx);
      return referenced.value;
    }

    if (tree.children.length === 0 && !this._functions.isFunction(tree.value)) {
      const parsed = parseFloat(tree.value);
      if (isNaN(parsed))
        throw new InvalidExpressionValueException("expression", tree.value);
      return parsed;
    }

    const evaluatedChildren: number[] = [];
    for (let i = tree.children.length; i > 0; i--) {
      const child = tree.children[i - 1];
      if (child === undefined)
        throw new Error(`Missing child at index ${i - 1} for '${tree.value}'`);
      evaluatedChildren.push(
        this.evaluateTree(child, expressionTable, calcCtx, exprCtx)
      );
    }

    if (!this._functions.isFunction(tree.value))
      throw new NonOperationException(tree.value);

    return this._functions
      .function(tree.value)
      .evaluate(calcCtx, exprCtx, evaluatedChildren);
  }
}
