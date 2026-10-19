import type { IFunctionLibrary } from "../interfaces/IFunctionLibrary.js";
import type { ExpressionTree } from "../models/ExpressionTree.js";
import { BaseParser, createTreeNode } from "./BaseParser.js";

export class ParameterParser<TCalc, TExpr> extends BaseParser<TCalc, TExpr> {
  override parse(
    _token: string,
    outputStack: ExpressionTree[],
    operatorStack: string[],
    library: IFunctionLibrary<TCalc, TExpr>
  ): void {
    while (
      operatorStack.length > 0 &&
      operatorStack.at(-1) !== "(" &&
      operatorStack.at(-1) !== ","
    ) {
      outputStack.push(
        createTreeNode(operatorStack.pop()!, outputStack, library)
      );
    }
    if (operatorStack.length > 0 && operatorStack.at(-1) === ",") {
      operatorStack.pop();
    }
  }
}
