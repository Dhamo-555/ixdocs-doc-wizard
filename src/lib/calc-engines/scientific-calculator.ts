/**
 * Safe Scientific Calculator Engine
 *
 * Implements a token-based expression parser and evaluator for scientific
 * calculations. Zero usage of eval() or Function() constructor.
 */

export type AngleMode = "deg" | "rad";

export interface EvaluationResult {
  success: boolean;
  value?: number;
  error?: string;
}

// ─── Mathematical Utility Functions ───────────────────────────────────────────

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // IEEE 754 limit
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function toRadians(angle: number, mode: AngleMode): number {
  return mode === "deg" ? (angle * Math.PI) / 180 : angle;
}

export function fromRadians(rad: number, mode: AngleMode): number {
  return mode === "deg" ? (rad * 180) / Math.PI : rad;
}

// ─── Tokenizer ────────────────────────────────────────────────────────────────

type TokenType = "NUMBER" | "OP" | "LPAREN" | "RPAREN" | "FUNC" | "POSTFIX";

interface Token {
  type: TokenType;
  value: string;
}

const SUPPORTED_FUNCTIONS = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "log",
  "ln",
  "sqrt",
  "cbrt",
  "abs",
]);

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = expression.replace(/\s+/g, "");

  while (i < s.length) {
    const ch = s[i]!;

    // Number (integer or decimal)
    if (/[0-9.]/.test(ch)) {
      let numStr = "";
      while (i < s.length && /[0-9.]/.test(s[i]!)) {
        numStr += s[i];
        i++;
      }
      tokens.push({ type: "NUMBER", value: numStr });
      continue;
    }

    // Constants: pi, e
    if (s.startsWith("π", i) || s.startsWith("pi", i)) {
      const len = s.startsWith("π", i) ? 1 : 2;
      tokens.push({ type: "NUMBER", value: Math.PI.toString() });
      i += len;
      continue;
    }

    if (ch === "e" && (i + 1 >= s.length || !/[a-z]/i.test(s[i + 1]!))) {
      tokens.push({ type: "NUMBER", value: Math.E.toString() });
      i++;
      continue;
    }

    // Identifiers (function names)
    if (/[a-zA-Z]/.test(ch)) {
      let id = "";
      while (i < s.length && /[a-zA-Z0-9]/.test(s[i]!)) {
        id += s[i]!.toLowerCase();
        i++;
      }
      if (SUPPORTED_FUNCTIONS.has(id)) {
        tokens.push({ type: "FUNC", value: id });
      } else {
        throw new Error(`Unknown function: "${id}"`);
      }
      continue;
    }

    // Parentheses
    if (ch === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }

    // Factorial postfix
    if (ch === "!") {
      tokens.push({ type: "POSTFIX", value: "!" });
      i++;
      continue;
    }

    // Operators: +, -, *, /, ^, %
    const opMap: Record<string, string> = {
      "+": "+",
      "-": "-",
      "−": "-",
      "*": "*",
      "×": "*",
      "/": "/",
      "÷": "/",
      "^": "^",
      "%": "%",
    };

    if (opMap[ch]) {
      tokens.push({ type: "OP", value: opMap[ch]! });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: "${ch}"`);
  }

  return tokens;
}

// ─── Shunting-Yard Parser & Evaluator ─────────────────────────────────────────

const OPERATOR_PRECEDENCE: Record<string, { prec: number; rightAssoc: boolean }> = {
  "+": { prec: 1, rightAssoc: false },
  "-": { prec: 1, rightAssoc: false },
  "%": { prec: 2, rightAssoc: false },
  "*": { prec: 2, rightAssoc: false },
  "/": { prec: 2, rightAssoc: false },
  "^": { prec: 3, rightAssoc: true },
  "u-": { prec: 4, rightAssoc: true }, // Unary minus
};

export function evaluateExpression(
  expression: string,
  angleMode: AngleMode = "deg",
): EvaluationResult {
  if (!expression.trim()) {
    return { success: true, value: 0 };
  }

  try {
    const rawTokens = tokenize(expression);
    if (rawTokens.length === 0) return { success: true, value: 0 };

    // Disambiguate unary minus vs binary minus and handle implicit multiplication
    const tokens: Token[] = [];
    for (let i = 0; i < rawTokens.length; i++) {
      const tok = rawTokens[i]!;
      const prev = tokens[tokens.length - 1];

      // Implicit multiplication: e.g. "2(3)" or "2sin(30)" or "(2)(3)"
      if (
        prev &&
        (prev.type === "NUMBER" || prev.type === "RPAREN" || prev.type === "POSTFIX") &&
        (tok.type === "FUNC" ||
          tok.type === "LPAREN" ||
          (tok.type === "NUMBER" && prev.type === "RPAREN"))
      ) {
        tokens.push({ type: "OP", value: "*" });
      }

      if (tok.type === "OP" && tok.value === "-") {
        if (!prev || prev.type === "OP" || prev.type === "LPAREN") {
          tokens.push({ type: "OP", value: "u-" });
          continue;
        }
      }

      tokens.push(tok);
    }

    // Shunting-yard to postfix (RPN)
    const outputQueue: Token[] = [];
    const opStack: Token[] = [];

    for (const tok of tokens) {
      if (tok.type === "NUMBER") {
        outputQueue.push(tok);
      } else if (tok.type === "FUNC") {
        opStack.push(tok);
      } else if (tok.type === "POSTFIX") {
        outputQueue.push(tok);
      } else if (tok.type === "OP") {
        const o1 = tok.value;
        const p1 = OPERATOR_PRECEDENCE[o1];

        while (opStack.length > 0) {
          const top = opStack[opStack.length - 1]!;
          if (top.type === "FUNC") {
            outputQueue.push(opStack.pop()!);
            continue;
          }
          if (top.type === "OP") {
            const o2 = top.value;
            const p2 = OPERATOR_PRECEDENCE[o2];
            if (
              p2 &&
              p1 &&
              ((!p1.rightAssoc && p1.prec <= p2.prec) || (p1.rightAssoc && p1.prec < p2.prec))
            ) {
              outputQueue.push(opStack.pop()!);
              continue;
            }
          }
          break;
        }
        opStack.push(tok);
      } else if (tok.type === "LPAREN") {
        opStack.push(tok);
      } else if (tok.type === "RPAREN") {
        let foundLeft = false;
        while (opStack.length > 0) {
          const top = opStack.pop()!;
          if (top.type === "LPAREN") {
            foundLeft = true;
            break;
          }
          outputQueue.push(top);
        }
        if (!foundLeft) {
          return { success: false, error: "Mismatched parentheses" };
        }
        if (opStack.length > 0 && opStack[opStack.length - 1]!.type === "FUNC") {
          outputQueue.push(opStack.pop()!);
        }
      }
    }

    while (opStack.length > 0) {
      const top = opStack.pop()!;
      if (top.type === "LPAREN" || top.type === "RPAREN") {
        return { success: false, error: "Mismatched parentheses" };
      }
      outputQueue.push(top);
    }

    // Evaluate RPN
    const valStack: number[] = [];

    for (const tok of outputQueue) {
      if (tok.type === "NUMBER") {
        const n = parseFloat(tok.value);
        if (isNaN(n)) return { success: false, error: `Invalid number: ${tok.value}` };
        valStack.push(n);
      } else if (tok.type === "POSTFIX" && tok.value === "!") {
        if (valStack.length < 1) return { success: false, error: "Missing operand for factorial" };
        const a = valStack.pop()!;
        const res = factorial(a);
        if (isNaN(res))
          return { success: false, error: "Factorial requires a non-negative integer" };
        valStack.push(res);
      } else if (tok.type === "OP") {
        if (tok.value === "u-") {
          if (valStack.length < 1)
            return { success: false, error: "Missing operand for unary minus" };
          const a = valStack.pop()!;
          valStack.push(-a);
          continue;
        }

        if (valStack.length < 2) return { success: false, error: "Missing operand" };
        const b = valStack.pop()!;
        const a = valStack.pop()!;

        switch (tok.value) {
          case "+":
            valStack.push(a + b);
            break;
          case "-":
            valStack.push(a - b);
            break;
          case "*":
            valStack.push(a * b);
            break;
          case "/":
            if (b === 0) return { success: false, error: "Division by zero" };
            valStack.push(a / b);
            break;
          case "%":
            valStack.push(a % b);
            break;
          case "^":
            valStack.push(Math.pow(a, b));
            break;
          default:
            return { success: false, error: `Unknown operator: ${tok.value}` };
        }
      } else if (tok.type === "FUNC") {
        if (valStack.length < 1)
          return { success: false, error: `Missing argument for ${tok.value}()` };
        const arg = valStack.pop()!;
        let res: number;

        switch (tok.value) {
          case "sin": {
            const rad = toRadians(arg, angleMode);
            res = Math.abs(rad % Math.PI) < 1e-15 ? 0 : Math.sin(rad);
            break;
          }
          case "cos": {
            const rad = toRadians(arg, angleMode);
            res = Math.abs((rad - Math.PI / 2) % Math.PI) < 1e-15 ? 0 : Math.cos(rad);
            break;
          }
          case "tan": {
            const rad = toRadians(arg, angleMode);
            if (Math.abs((rad - Math.PI / 2) % Math.PI) < 1e-15) {
              return { success: false, error: "Tangent undefined at this angle" };
            }
            res = Math.tan(rad);
            break;
          }
          case "asin": {
            if (arg < -1 || arg > 1) return { success: false, error: "asin domain is [-1, 1]" };
            res = fromRadians(Math.asin(arg), angleMode);
            break;
          }
          case "acos": {
            if (arg < -1 || arg > 1) return { success: false, error: "acos domain is [-1, 1]" };
            res = fromRadians(Math.acos(arg), angleMode);
            break;
          }
          case "atan": {
            res = fromRadians(Math.atan(arg), angleMode);
            break;
          }
          case "log": {
            if (arg <= 0)
              return { success: false, error: "Logarithm undefined for non-positive numbers" };
            res = Math.log10(arg);
            break;
          }
          case "ln": {
            if (arg <= 0)
              return { success: false, error: "Natural log undefined for non-positive numbers" };
            res = Math.log(arg);
            break;
          }
          case "sqrt": {
            if (arg < 0) return { success: false, error: "Square root of negative number" };
            res = Math.sqrt(arg);
            break;
          }
          case "cbrt": {
            res = Math.cbrt(arg);
            break;
          }
          case "abs": {
            res = Math.abs(arg);
            break;
          }
          default:
            return { success: false, error: `Unhandled function: ${tok.value}` };
        }
        valStack.push(res);
      }
    }

    if (valStack.length !== 1) {
      return { success: false, error: "Invalid expression format" };
    }

    const finalVal = valStack[0]!;
    if (isNaN(finalVal)) return { success: false, error: "Result is undefined" };
    if (!isFinite(finalVal)) return { success: false, error: "Result overflowed to infinity" };

    const rounded = Math.abs(finalVal) < 1e-12 ? 0 : Number(finalVal.toPrecision(12)) / 1;

    return { success: true, value: rounded };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Calculation error",
    };
  }
}
