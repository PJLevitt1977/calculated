import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import type { ExpressionTree } from "../models/ExpressionTree.js";
import { BaseParser, createTreeNode } from "./BaseParser.js";

export class BinaryOperationParser<TCalc, TExpr> extends BaseParser<TCalc, TExpr> {
  override parse(
    token: string,
    outputStack: ExpressionTree[],
    operatorStack: string[],
    library: IFunctionLibrary<TCalc, TExpr>
  ): void {
    while (
      operatorStack.length > 0 &&
      library.priority(token) <= library.priority(operatorStack.at(-1)!)
    ) {
      outputStack.push(
        createTreeNode(operatorStack.pop()!, outputStack, library)
      );
    }
    operatorStack.push(token);
  }
}
