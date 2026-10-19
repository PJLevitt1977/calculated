import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import type { IParser } from "../interfaces/IParser.js";
import { ExpressionTree } from "../models/ExpressionTree.js";

export function createTreeNode<TCalc, TExpr>(
  op: string,
  values: ExpressionTree[],
  library: IFunctionLibrary<TCalc, TExpr>
): ExpressionTree {
  const fn = library.function(op);
  const tree = new ExpressionTree(op, fn.noOfChildren);
  for (let i = 0; i < fn.noOfChildren; i++) {
    const child = values.pop();
    if (child === undefined)
      throw new Error(
        `Not enough values for '${op}': expected ${fn.noOfChildren}, got ${i}`
      );
    tree.children[i] = child;
  }
  return tree;
}

export abstract class BaseParser<TCalc, TExpr> implements IParser<TCalc, TExpr> {
  abstract parse(
    token: string,
    outputStack: ExpressionTree[],
    operatorStack: string[],
    library: IFunctionLibrary<TCalc, TExpr>
  ): void;
}
