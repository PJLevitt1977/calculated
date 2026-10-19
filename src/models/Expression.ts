import { ExpressionState } from "../enums.js";
import type { ExpressionTree } from "./ExpressionTree.js";

export class Expression<TExpr> {
  name: string;
  calculation: string;
  context: TExpr | null;
  value: number;
  status: ExpressionState;
  expressionTree: ExpressionTree | null;

  constructor(name: string, calculation: string, context: TExpr | null = null) {
    this.name = name;
    this.calculation = calculation;
    this.context = context;
    this.value = 0;
    this.status = ExpressionState.NotCalculated;
    this.expressionTree = null;
  }
}
