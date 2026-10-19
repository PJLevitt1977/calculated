export abstract class BaseFunction<TCalc, TExpr> {
  abstract name: string;
  abstract displayName: string;

  get noOfChildren(): number {
    return 0;
  }

  get signature(): string {
    if (this.noOfChildren === 0) return this.name;
    const params = Array.from({ length: this.noOfChildren }, (_, i) => `{${i}}`);
    return `${this.name}(${params.join(", ")})`;
  }

  get parameterNames(): string[] {
    return new Array<string>(this.noOfChildren);
  }
}
