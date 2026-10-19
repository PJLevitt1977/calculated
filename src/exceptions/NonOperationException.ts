export class NonOperationException extends Error {
  constructor(name: string) {
    super(`'${name}' is a structural token and cannot be evaluated.`);
    this.name = "NonOperationException";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
