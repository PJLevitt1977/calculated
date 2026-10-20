# calculated

A small, dependency-free expression evaluation engine for TypeScript and Node.js.

Give it a set of **named expressions** that can refer to each other, and it works out the dependency order, evaluates everything, and hands back a name → number map. Think spreadsheet cells, pricing rules or formula fields, without the spreadsheet.

```ts
import { createCalculator } from "calculated";

const calc = **createCalculator**();

calc.performCalculation(
  {
    subTotal: "100",
    VAT: "subTotal * 0.2",
    total: "subTotal + VAT",
    CAPPED: "MIN(total, 110)",
    ROUNDED: "ROUNDUP(total, 5)",
  },
  {}
);
// { subTotal: 100, VAT: 20, total: 120, CAPPED: 110, ROUNDED: 120 }
```

## Features

- **Named expressions that reference each other.** Dependencies are resolved on demand, so declaration order doesn't matter.
- **Circular reference detection.** Cycles throw a `CircularReferenceException` instead of recursing forever.
- **Standard arithmetic.** `+ - * /`, brackets, unary `+`/`-`, decimal literals, correct operator precedence.
- **Built-in functions.** `MIN`, `MAX`, `ROUNDUP`, `ROUNDDOWN`.
- **Pluggable custom functions.** Register your own functions that receive a caller-supplied context object.
- **Validation without calculating.** `isValidExpression` checks a set of expressions and reports the first error.
- **Strict, fully typed.** TypeScript with `strict`, `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`. ESM only, with generated type declarations.
- **No runtime dependencies.**

## Installation

The package isn't published to npm yet. Install it from source:

```bash
git clone https://github.com/PJLevitt1977/calculated.git
cd calculated
npm install
npm run build
```

Requires a Node.js version with ESM and ES2022 support. The package entry point is `./dist/index.js`, so build before consuming it from another project.

## Usage

### Evaluating expressions

`performCalculation(expressions, context)` takes a record of `name → expression string` and returns a record of `name → number`.

```ts
calc.performCalculation({ X: "10", Y: "X + 5", Z: "Y * 2" }, {});
// { X: 10, Y: 15, Z: 30 }
```

Expressions can be declared in any order:

```ts
calc.performCalculation(
  { total: "subTotal + VAT", subTotal: "100", VAT: "subTotal * 0.2" },
  {}
);
// { total: 120, subTotal: 100, VAT: 20 }
```

### Validating expressions

```ts
calc.isValidExpression({ A: "2 + 3" }); // true

calc.isValidExpression({ A: "FOO" }); // false
calc.lastErrorMessage;
// "Expression 'expression' has an invalid value: 'FOO' cannot be parsed as a number."
```

Evaluation-time problems (unknown identifiers, bad operands) return `false` and set `lastErrorMessage`. Malformed syntax, such as a dangling operator in `"2 +"`, currently **throws** from the parser, so wrap the call in `try/catch` when validating untrusted input.

### Circular references

```ts
import { CircularReferenceException } from "calculated";

try {
  calc.performCalculation({ A: "B", B: "A" }, {});
} catch (err) {
  if (err instanceof CircularReferenceException) {
    console.error(err.message); // "Circular reference detected: A"
  }
}
```

### Custom functions

Extend `CustomFunction<TCalc, TExpr>`, declare a `name`, `displayName` and `noOfChildren` (the argument count), and implement `evaluate`. `TCalc` is the type of the context passed to `performCalculation`, so functions can read external data such as rates or lookup tables.

```ts
import { createCalculator, CustomFunction } from "calculated";

interface Ctx {
  rate: number;
}

class TaxFunction extends CustomFunction<Ctx, unknown> {
  name = "TAX";
  displayName = "Tax";

  override get noOfChildren() {
    return 1;
  }
  override get parameterNames() {
    return ["Amount"];
  }

  override evaluate(calcCtx: Ctx, _exprCtx: unknown, params: number[]): number {
    return params[0]! * calcCtx.rate;
  }
}

const calc = createCalculator<Ctx, unknown>([new TaxFunction()]);

calc.performCalculation({ NET: "200", DUTY: "TAX(NET)" }, { rate: 0.2 });
// { NET: 200, DUTY: 40 }

calc.functions.functions; // ["MIN", "MAX", "ROUNDUP", "ROUNDDOWN", "TAX"]
calc.functions.getFunctionSignature("TAX"); // "TAX({0})"
```

Registering a name that already exists (including the built-ins) throws.

## Reference

### Built-in functions

| Function | Description |
| --- | --- |
| `MIN(value, minimum)` | The smaller of the two values. |
| `MAX(value, maximum)` | The larger of the two values. |
| `ROUNDDOWN(value, factor)` | Rounds `value` down to the nearest multiple of `factor`. |
| `ROUNDUP(value, factor)` | Rounds `value` up to the nearest multiple of `factor`. |

`ROUNDUP` and `ROUNDDOWN` round to a **multiple**, not to decimal places: `ROUNDDOWN(7.777, 1)` is `7`, and `ROUNDUP(7.711, 0.1)` is `7.8`. A factor of `0` returns the value unchanged.

### Operators

| Operator | Meaning | Precedence |
| --- | --- | --- |
| unary `-`, `+` | sign | 3 (highest) |
| `*`, `/` | multiply, divide | 2 |
| `+`, `-` | add, subtract | 1 |

Brackets override precedence. Division follows JavaScript semantics, so dividing by zero yields `Infinity` rather than an error.

### Exceptions

All are exported from the package root.

| Exception | Thrown when |
| --- | --- |
| `CircularReferenceException` | Expressions depend on each other in a cycle. Carries `cyclePath`. |
| `InvalidExpressionValueException` | A token is neither a known name, function nor a number. |
| `BinaryOperationException` / `UnaryOperationException` | An operator's evaluator fails. Carries a `suggestion`. |
| `NonOperationException` | A structural token such as `(` or `,` is evaluated as an operation. |
| `FunctionException` | Abstract base for the operator exceptions. |

## How it works

```
expression strings
      │
      ▼
 Tokenizer ──► ExpressionParser ──► ExpressionTree (one per expression)
 (split, upper-case)  (per-function parsers)          │
                                                      ▼
                                             ExpressionEvaluator
                                    (resolves references, detects cycles)
                                                      │
                                                      ▼
                                           Record<string, number>
```

1. **Tokenizer** strips whitespace, splits on operators and brackets, and upper-cases tokens.
2. **ExpressionParser** converts tokens into an `ExpressionTree`. Every operator and function lives in the **FunctionLibrary** and supplies its own parser, which is how custom functions plug in without touching the core.
3. **ExpressionEvaluator** walks each tree. On meeting the name of another expression it evaluates that one first, tracking `NotCalculated → InProgress → Calculated`. Meeting an `InProgress` expression means a cycle.
4. **Calculator** ties parser and evaluator together. `createCalculator()` wires up the defaults.

Each collaborator sits behind an interface (`ICalculator`, `IExpressionParser`, `IExpressionEvaluator`, `IFunctionLibrary`, `ITokenizer`, `IParser`, `ICalculatorFunction`), so any stage can be replaced.

## Development

```bash
npm install
npm test            # run the Vitest suite once
npm run test:watch  # watch mode
npm run typecheck   # tsc --noEmit
npm run build       # compile to ./dist
```

Coverage: `npx vitest run --coverage`.

```
src/
  calculator/   Calculator, the public entry point
  evaluators/   ExpressionEvaluator (dependency resolution, cycle detection)
  parsers/      ExpressionParser plus per-token parsers
  tokenizer/    Tokenizer
  functions/    FunctionLibrary, operations, CustomFunction base, builtins/
  interfaces/   Contracts for every collaborator
  models/       Expression, ExpressionTree
  exceptions/   Typed error classes
tests/
  unit/         Tokenizer, function library, built-ins, exceptions
  integration/  End-to-end calculation, custom functions, circular references
```

## Background

This is a TypeScript port of an earlier .NET expression engine. The port was performed by Claude Code, using Sonnet with a single prompt.

## License

[MIT](./LICENSE) © 2026 Paul Levitt
