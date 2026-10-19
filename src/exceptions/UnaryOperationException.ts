import { FunctionException } from "./FunctionException.js";

export class UnaryOperationException extends FunctionException {
  constructor(operator: string, operand: string, suggestion: string) {
    super(
      `Error evaluating unary operation: ${operator}${operand}`,
      suggestion
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
