export class InvalidExpressionValueException extends Error {
  constructor(expressionName: string, rawValue: string) {
    super(
      `Expression '${expressionName}' has an invalid value: '${rawValue}' cannot be parsed as a number.`
    );
    this.name = "InvalidExpressionValueException";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
