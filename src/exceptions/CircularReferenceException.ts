export class CircularReferenceException extends Error {
  readonly cyclePath: string[];

  constructor(cyclePath: string[]) {
    super(`Circular reference detected: ${cyclePath.join(" → ")}`);
    this.name = "CircularReferenceException";
    this.cyclePath = cyclePath;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
