export abstract class FunctionException extends Error {
  readonly suggestion: string;

  constructor(message: string, suggestion: string) {
    super(message);
    this.name = this.constructor.name;
    this.suggestion = suggestion;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
