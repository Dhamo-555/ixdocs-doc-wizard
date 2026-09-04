/**
 * Safe, deterministic browser-side basic arithmetic expression evaluator.
 * Does NOT use eval() or Function constructor.
 */

export interface CalculationResult {
  result: number | null;
  display: string;
  error?: string;
  expression: string;
}

export function evaluateExpression(expr: string): CalculationResult {
  const sanitized = expr.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/");

  if (!sanitized) {
    return { result: null, display: "0", expression: "" };
  }

  try {
    const tokens = tokenize(sanitized);
    if (tokens.length === 0) {
      return { result: null, display: "0", expression: expr };
    }
    const rpn = toRpn(tokens);
    const value = evalRpn(rpn);

    if (!Number.isFinite(value)) {
      return {
        result: null,
        display: "Error: Division by zero",
        error: "Division by zero or invalid operation",
        expression: expr,
      };
    }

    // Format display cleanly
    const formatted = formatNumber(value);
    return {
      result: value,
      display: formatted,
      expression: expr,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid expression";
    return {
      result: null,
      display: "Error",
      error: message,
      expression: expr,
    };
  }
}

function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Avoid floating point precision quirks like 0.1 + 0.2 = 0.30000000000000004
  const rounded = parseFloat(num.toPrecision(12));
  return rounded.toString();
}

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: "+" | "-" | "*" | "/" | "%" | "^" }
  | { type: "paren"; value: "(" | ")" };

function tokenize(str: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < str.length) {
    const ch = str[i];

    if ("+-*/%^".includes(ch)) {
      // Check if minus is unary negation
      if (ch === "-") {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === "op" || (prev.type === "paren" && prev.value === "(")) {
          // Unary minus: read the following number
          i++;
          let numStr = "-";
          while (i < str.length && /[0-9.]/.test(str[i])) {
            numStr += str[i];
            i++;
          }
          if (numStr === "-") {
            throw new Error("Invalid negative number");
          }
          const num = parseFloat(numStr);
          if (Number.isNaN(num)) throw new Error("Invalid number");
          tokens.push({ type: "num", value: num });
          continue;
        }
      }

      tokens.push({ type: "op", value: ch as Token & { type: "op" }["value"] });
      i++;
      continue;
    }

    if (ch === "(" || ch === ")") {
      tokens.push({ type: "paren", value: ch });
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = "";
      while (i < str.length && /[0-9.]/.test(str[i])) {
        numStr += str[i];
        i++;
      }
      const num = parseFloat(numStr);
      if (Number.isNaN(num)) throw new Error(`Invalid number: ${numStr}`);
      tokens.push({ type: "num", value: num });
      continue;
    }

    throw new Error(`Unexpected character: '${ch}'`);
  }

  return tokens;
}

const PRECEDENCE: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
  "^": 3,
};

function toRpn(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const opStack: (Token & { type: "op" | "paren" })[] = [];

  for (const token of tokens) {
    if (token.type === "num") {
      output.push(token);
    } else if (token.type === "op") {
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (
          top &&
          top.type === "op" &&
          (PRECEDENCE[top.value] ?? 0) >= (PRECEDENCE[token.value] ?? 0)
        ) {
          output.push(opStack.pop()!);
        } else {
          break;
        }
      }
      opStack.push(token);
    } else if (token.type === "paren" && token.value === "(") {
      opStack.push(token);
    } else if (token.type === "paren" && token.value === ")") {
      let foundOpen = false;
      while (opStack.length > 0) {
        const top = opStack.pop()!;
        if (top.type === "paren" && top.value === "(") {
          foundOpen = true;
          break;
        }
        output.push(top);
      }
      if (!foundOpen) throw new Error("Mismatched parentheses");
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop()!;
    if (top.type === "paren") throw new Error("Mismatched parentheses");
    output.push(top);
  }

  return output;
}

function evalRpn(rpn: Token[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === "num") {
      stack.push(token.value);
    } else if (token.type === "op") {
      if (stack.length < 2) throw new Error("Invalid expression");
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token.value) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          stack.push(a / b);
          break;
        case "%":
          stack.push(a % b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
      }
    }
  }

  if (stack.length !== 1 || stack[0] === undefined) throw new Error("Malformed expression");
  return stack[0];
}
