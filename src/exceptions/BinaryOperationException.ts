import { FunctionException } from "./FunctionException.js";

export class BinaryOperationException extends FunctionException {
  constructor(
    operator: string,
    left: string,
    right: string,
    suggestion: string
  ) {
    super(
      `Error evaluating binary operation: ${left} ${operator} ${right}`,
      suggestion
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
