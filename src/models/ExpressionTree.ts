export class ExpressionTree {
  value: string;
  children: ExpressionTree[];

  constructor(value: string, noOfChildren: number = 0) {
    this.value = value;
    this.children = new Array<ExpressionTree>(noOfChildren);
  }
}
