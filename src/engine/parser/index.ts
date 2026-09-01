/**
 * CalcRick Safe Expression Parser & Deterministic Evaluator
 * Follows Prime Directives: PD-1 (Accuracy), PD-3 (Safe AST Parser, No Eval), PD-6 (Exact vs Approx)
 */

import { AngleUnit } from "@/types";

export type TokenType =
  | "NUMBER"
  | "IDENTIFIER"
  | "PLUS"
  | "MINUS"
  | "MULTIPLY"
  | "DIVIDE"
  | "POWER"
  | "PERCENT"
  | "FACTORIAL"
  | "LPAREN"
  | "RPAREN"
  | "COMMA"
  | "EQUALS"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

export type ASTNode =
  | { type: "Number"; value: number; raw: string }
  | { type: "Identifier"; name: string }
  | { type: "UnaryOp"; operator: "+" | "-" | "!"; argument: ASTNode }
  | { type: "BinaryOp"; operator: "+" | "-" | "*" | "/" | "^" | "%" | "mod"; left: ASTNode; right: ASTNode }
  | { type: "FunctionCall"; name: string; args: ASTNode[] }
  | { type: "Assignment"; name: string; value: ASTNode };

export class Tokenizer {
  private pos = 0;
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];

      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }

      if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(this.input[this.pos + 1] || ""))) {
        tokens.push(this.readNumber());
        continue;
      }

      if (/[a-zA-Z_πφ]/.test(ch)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      if (ch === "+") {
        tokens.push({ type: "PLUS", value: "+", pos: this.pos++ });
      } else if (ch === "-" || ch === "−" || ch === "–") {
        tokens.push({ type: "MINUS", value: "-", pos: this.pos++ });
      } else if (ch === "*" || ch === "×" || ch === "·") {
        tokens.push({ type: "MULTIPLY", value: "*", pos: this.pos++ });
      } else if (ch === "/" || ch === "÷") {
        tokens.push({ type: "DIVIDE", value: "/", pos: this.pos++ });
      } else if (ch === "^") {
        tokens.push({ type: "POWER", value: "^", pos: this.pos++ });
      } else if (ch === "%") {
        tokens.push({ type: "PERCENT", value: "%", pos: this.pos++ });
      } else if (ch === "!") {
        tokens.push({ type: "FACTORIAL", value: "!", pos: this.pos++ });
      } else if (ch === "(") {
        tokens.push({ type: "LPAREN", value: "(", pos: this.pos++ });
      } else if (ch === ")") {
        tokens.push({ type: "RPAREN", value: ")", pos: this.pos++ });
      } else if (ch === ",") {
        tokens.push({ type: "COMMA", value: ",", pos: this.pos++ });
      } else if (ch === "=") {
        tokens.push({ type: "EQUALS", value: "=", pos: this.pos++ });
      } else {
        throw new Error(`Unexpected character '${ch}' at index ${this.pos}`);
      }
    }

    tokens.push({ type: "EOF", value: "", pos: this.pos });
    return tokens;
  }

  private readNumber(): Token {
    const start = this.pos;
    let hasDot = false;
    let hasExp = false;

    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (/[0-9]/.test(ch)) {
        this.pos++;
      } else if (ch === "." && !hasDot && !hasExp) {
        hasDot = true;
        this.pos++;
      } else if ((ch === "e" || ch === "E") && !hasExp && this.pos > start) {
        hasExp = true;
        this.pos++;
        if (this.input[this.pos] === "+" || this.input[this.pos] === "-") {
          this.pos++;
        }
      } else {
        break;
      }
    }

    const numStr = this.input.slice(start, this.pos);
    return { type: "NUMBER", value: numStr, pos: start };
  }

  private readIdentifier(): Token {
    const start = this.pos;
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (/[a-zA-Z0-9_πφ]/.test(ch)) {
        this.pos++;
      } else {
        break;
      }
    }
    const id = this.input.slice(start, this.pos);
    return { type: "IDENTIFIER", value: id, pos: start };
  }
}

export class SafeParser {
  private tokens: Token[] = [];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ASTNode {
    if (this.peek().type === "EOF") {
      throw new Error("Empty expression");
    }
    const node = this.parseAssignment();
    if (this.peek().type !== "EOF") {
      throw new Error(`Unexpected token '${this.peek().value}' at index ${this.peek().pos}`);
    }
    return node;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: "EOF", value: "", pos: 0 };
  }

  private consume(expectedType?: TokenType): Token {
    const token = this.peek();
    if (expectedType && token.type !== expectedType) {
      throw new Error(`Expected ${expectedType} but found '${token.value}' at index ${token.pos}`);
    }
    this.current++;
    return token;
  }

  private parseAssignment(): ASTNode {
    if (
      this.peek().type === "IDENTIFIER" &&
      this.tokens[this.current + 1]?.type === "EQUALS"
    ) {
      const idToken = this.consume("IDENTIFIER");
      this.consume("EQUALS");
      const val = this.parseExpression();
      return { type: "Assignment", name: idToken.value, value: val };
    }
    return this.parseExpression();
  }

  private parseExpression(): ASTNode {
    return this.parseAddition();
  }

  private parseAddition(): ASTNode {
    let left = this.parseMultiplication();

    while (this.peek().type === "PLUS" || this.peek().type === "MINUS") {
      const op = this.consume();
      const right = this.parseMultiplication();
      left = {
        type: "BinaryOp",
        operator: op.type === "PLUS" ? "+" : "-",
        left,
        right,
      };
    }

    return left;
  }

  private parseMultiplication(): ASTNode {
    let left = this.parsePower();

    while (
      this.peek().type === "MULTIPLY" ||
      this.peek().type === "DIVIDE" ||
      this.peek().type === "PERCENT" ||
      (this.peek().type === "IDENTIFIER" && this.peek().value.toLowerCase() === "mod")
    ) {
      const token = this.consume();
      let operator: "*" | "/" | "%" | "mod" = "*";
      if (token.type === "DIVIDE") operator = "/";
      else if (token.type === "PERCENT") operator = "%";
      else if (token.type === "IDENTIFIER" && token.value.toLowerCase() === "mod") operator = "mod";

      const right = this.parsePower();
      left = { type: "BinaryOp", operator, left, right };
    }

    return left;
  }

  private parsePower(): ASTNode {
    let left = this.parseUnary();

    if (this.peek().type === "POWER") {
      this.consume("POWER");
      const right = this.parsePower(); // right-associative: 2^3^2 = 2^(3^2)
      return { type: "BinaryOp", operator: "^", left, right };
    }

    return left;
  }

  private parseUnary(): ASTNode {
    if (this.peek().type === "PLUS") {
      this.consume("PLUS");
      return { type: "UnaryOp", operator: "+", argument: this.parseUnary() };
    }
    if (this.peek().type === "MINUS") {
      this.consume("MINUS");
      return { type: "UnaryOp", operator: "-", argument: this.parseUnary() };
    }

    let node = this.parsePostfix();
    return node;
  }

  private parsePostfix(): ASTNode {
    let node = this.parsePrimary();

    while (this.peek().type === "FACTORIAL") {
      this.consume("FACTORIAL");
      node = { type: "UnaryOp", operator: "!", argument: node };
    }

    // Check for implicit multiplication e.g., 2(3), 3pi, (2)(3), 4x
    while (
      this.peek().type === "LPAREN" ||
      this.peek().type === "NUMBER" ||
      this.peek().type === "IDENTIFIER"
    ) {
      // Avoid parsing 'mod' as implicit multiplication
      if (this.peek().type === "IDENTIFIER" && this.peek().value.toLowerCase() === "mod") {
        break;
      }
      const right = this.parsePrimary();
      node = { type: "BinaryOp", operator: "*", left: node, right };
    }

    return node;
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (token.type === "NUMBER") {
      this.consume("NUMBER");
      return { type: "Number", value: parseFloat(token.value), raw: token.value };
    }

    if (token.type === "IDENTIFIER") {
      this.consume("IDENTIFIER");
      const name = token.value;

      // Function call check e.g. sin(x), sqrt(16)
      if (this.peek().type === "LPAREN") {
        this.consume("LPAREN");
        const args: ASTNode[] = [];
        if (this.peek().type !== "RPAREN") {
          args.push(this.parseExpression());
          while (this.peek().type === "COMMA") {
            this.consume("COMMA");
            args.push(this.parseExpression());
          }
        }
        this.consume("RPAREN");
        return { type: "FunctionCall", name, args };
      }

      return { type: "Identifier", name };
    }

    if (token.type === "LPAREN") {
      this.consume("LPAREN");
      const expr = this.parseExpression();
      this.consume("RPAREN");
      return expr;
    }

    throw new Error(`Unexpected token '${token.value || "end of input"}' at index ${token.pos}`);
  }
}

export interface EvalContext {
  variables: Record<string, number>;
  angleUnit: AngleUnit;
  precision?: number;
}

export const KNOWN_CONSTANTS: Record<string, { value: number; symbol: string; name: string; description: string }> = {
  pi: { value: Math.PI, symbol: "π", name: "Pi", description: "Ratio of circle circumference to diameter (~3.14159)" },
  π: { value: Math.PI, symbol: "π", name: "Pi", description: "Ratio of circle circumference to diameter (~3.14159)" },
  e: { value: Math.E, symbol: "e", name: "Euler's Number", description: "Base of natural logarithm (~2.71828)" },
  phi: { value: (1 + Math.sqrt(5)) / 2, symbol: "φ", name: "Golden Ratio", description: "Divine proportion (~1.61803)" },
  φ: { value: (1 + Math.sqrt(5)) / 2, symbol: "φ", name: "Golden Ratio", description: "Divine proportion (~1.61803)" },
  sqrt2: { value: Math.SQRT2, symbol: "√2", name: "Pythagoras Constant", description: "Square root of 2 (~1.41421)" },
  c: { value: 299792458, symbol: "c", name: "Speed of Light", description: "Speed of light in vacuum (m/s)" },
  g: { value: 9.80665, symbol: "g", name: "Standard Gravity", description: "Earth surface acceleration (m/s²)" },
  h: { value: 6.62607015e-34, symbol: "h", name: "Planck Constant", description: "Quantum of electromagnetic action (J⋅s)" },
  k: { value: 1.380649e-23, symbol: "k", name: "Boltzmann Constant", description: "Relates thermal energy to temperature (J/K)" },
  na: { value: 6.02214076e23, symbol: "N_A", name: "Avogadro Number", description: "Particles per mole (mol⁻¹)" },
  r: { value: 8.314462618, symbol: "R", name: "Universal Gas Constant", description: "Ideal gas constant (J/(mol⋅K))" },
};

export class SafeEvaluator {
  public static evaluate(
    node: ASTNode,
    context: EvalContext = { variables: {}, angleUnit: "deg" }
  ): { value: number; exactText?: string; isExact?: boolean } {
    switch (node.type) {
      case "Number":
        return { value: node.value, exactText: node.raw, isExact: true };

      case "Identifier": {
        const key = node.name.toLowerCase();
        if (KNOWN_CONSTANTS[key]) {
          return { value: KNOWN_CONSTANTS[key].value, exactText: KNOWN_CONSTANTS[key].symbol, isExact: false };
        }
        if (context.variables && node.name in context.variables) {
          return { value: context.variables[node.name], isExact: true };
        }
        if (context.variables && key in context.variables) {
          return { value: context.variables[key], isExact: true };
        }
        throw new Error(`Undefined variable or constant '${node.name}'`);
      }

      case "Assignment": {
        const valRes = SafeEvaluator.evaluate(node.value, context);
        context.variables[node.name] = valRes.value;
        return valRes;
      }

      case "UnaryOp": {
        if (node.operator === "+") {
          return SafeEvaluator.evaluate(node.argument, context);
        }
        if (node.operator === "-") {
          const res = SafeEvaluator.evaluate(node.argument, context);
          return { value: -res.value, exactText: res.exactText ? `-${res.exactText}` : undefined, isExact: res.isExact };
        }
        if (node.operator === "!") {
          const res = SafeEvaluator.evaluate(node.argument, context);
          const n = res.value;
          if (n < 0 || !Number.isInteger(n)) {
            throw new Error(`Factorial is only defined for non-negative integers (got ${n})`);
          }
          if (n > 170) {
            throw new Error("Factorial overflow (maximum supported is 170!)");
          }
          let fact = 1;
          for (let i = 2; i <= n; i++) fact *= i;
          return { value: fact, isExact: true };
        }
        throw new Error(`Unknown unary operator ${node.operator}`);
      }

      case "BinaryOp": {
        const left = SafeEvaluator.evaluate(node.left, context);
        const right = SafeEvaluator.evaluate(node.right, context);

        switch (node.operator) {
          case "+":
            return { value: SafeEvaluator.cleanFloat(left.value + right.value), isExact: left.isExact && right.isExact };
          case "-":
            return { value: SafeEvaluator.cleanFloat(left.value - right.value), isExact: left.isExact && right.isExact };
          case "*":
            return { value: SafeEvaluator.cleanFloat(left.value * right.value), isExact: left.isExact && right.isExact };
          case "/":
            if (right.value === 0) {
              throw new Error("Division by zero");
            }
            return { value: SafeEvaluator.cleanFloat(left.value / right.value), isExact: false };
          case "%":
          case "mod":
            if (right.value === 0) {
              throw new Error("Modulo by zero");
            }
            return { value: ((left.value % right.value) + right.value) % right.value, isExact: true };
          case "^":
            return { value: Math.pow(left.value, right.value), isExact: Number.isInteger(right.value) && right.value >= 0 };
        }
        break;
      }

      case "FunctionCall": {
        const fn = node.name.toLowerCase();
        const evalArgs = node.args.map((a) => SafeEvaluator.evaluate(a, context).value);

        if (fn === "sin") {
          const rad = SafeEvaluator.toRadians(evalArgs[0], context.angleUnit);
          // Precise trig for common angles
          if (context.angleUnit === "deg") {
            const modDeg = ((evalArgs[0] % 360) + 360) % 360;
            if (modDeg === 0 || modDeg === 180) return { value: 0, isExact: true };
            if (modDeg === 90) return { value: 1, isExact: true };
            if (modDeg === 270) return { value: -1, isExact: true };
            if (modDeg === 30 || modDeg === 150) return { value: 0.5, isExact: true };
            if (modDeg === 210 || modDeg === 330) return { value: -0.5, isExact: true };
          }
          return { value: SafeEvaluator.cleanFloat(Math.sin(rad)), isExact: false };
        }

        if (fn === "cos") {
          const rad = SafeEvaluator.toRadians(evalArgs[0], context.angleUnit);
          if (context.angleUnit === "deg") {
            const modDeg = ((evalArgs[0] % 360) + 360) % 360;
            if (modDeg === 90 || modDeg === 270) return { value: 0, isExact: true };
            if (modDeg === 0) return { value: 1, isExact: true };
            if (modDeg === 180) return { value: -1, isExact: true };
            if (modDeg === 60 || modDeg === 300) return { value: 0.5, isExact: true };
            if (modDeg === 120 || modDeg === 240) return { value: -0.5, isExact: true };
          }
          return { value: SafeEvaluator.cleanFloat(Math.cos(rad)), isExact: false };
        }

        if (fn === "tan") {
          if (context.angleUnit === "deg") {
            const modDeg = ((evalArgs[0] % 180) + 180) % 180;
            if (modDeg === 90) throw new Error("Tangent is undefined at 90° + k·180°");
            if (modDeg === 45) return { value: 1, isExact: true };
            if (modDeg === 135) return { value: -1, isExact: true };
            if (modDeg === 0) return { value: 0, isExact: true };
          }
          const rad = SafeEvaluator.toRadians(evalArgs[0], context.angleUnit);
          return { value: SafeEvaluator.cleanFloat(Math.tan(rad)), isExact: false };
        }

        if (fn === "asin") {
          if (evalArgs[0] < -1 || evalArgs[0] > 1) {
            throw new Error("asin domain is [-1, 1]");
          }
          const resRad = Math.asin(evalArgs[0]);
          return { value: SafeEvaluator.fromRadians(resRad, context.angleUnit), isExact: false };
        }

        if (fn === "acos") {
          if (evalArgs[0] < -1 || evalArgs[0] > 1) {
            throw new Error("acos domain is [-1, 1]");
          }
          const resRad = Math.acos(evalArgs[0]);
          return { value: SafeEvaluator.fromRadians(resRad, context.angleUnit), isExact: false };
        }

        if (fn === "atan") {
          const resRad = Math.atan(evalArgs[0]);
          return { value: SafeEvaluator.fromRadians(resRad, context.angleUnit), isExact: false };
        }

        if (fn === "atan2") {
          const resRad = Math.atan2(evalArgs[0], evalArgs[1]);
          return { value: SafeEvaluator.fromRadians(resRad, context.angleUnit), isExact: false };
        }

        if (fn === "sqrt") {
          if (evalArgs[0] < 0) throw new Error("Cannot take square root of a negative number in real mode");
          const val = Math.sqrt(evalArgs[0]);
          return { value: SafeEvaluator.cleanFloat(val), isExact: Number.isInteger(val) };
        }

        if (fn === "cbrt") {
          return { value: SafeEvaluator.cleanFloat(Math.cbrt(evalArgs[0])), isExact: false };
        }

        if (fn === "log" || fn === "log10") {
          if (evalArgs[0] <= 0) throw new Error("Logarithm argument must be strictly positive");
          return { value: SafeEvaluator.cleanFloat(Math.log10(evalArgs[0])), isExact: false };
        }

        if (fn === "ln") {
          if (evalArgs[0] <= 0) throw new Error("Natural log argument must be strictly positive");
          return { value: SafeEvaluator.cleanFloat(Math.log(evalArgs[0])), isExact: false };
        }

        if (fn === "exp") {
          return { value: SafeEvaluator.cleanFloat(Math.exp(evalArgs[0])), isExact: false };
        }

        if (fn === "abs") {
          return { value: Math.abs(evalArgs[0]), isExact: true };
        }

        if (fn === "floor") return { value: Math.floor(evalArgs[0]), isExact: true };
        if (fn === "ceil") return { value: Math.ceil(evalArgs[0]), isExact: true };
        if (fn === "round") return { value: Math.round(evalArgs[0]), isExact: true };

        if (fn === "gcd") {
          if (evalArgs.length < 2) throw new Error("gcd requires 2 arguments");
          const gcd = (a: number, b: number): number => {
            a = Math.abs(Math.round(a));
            b = Math.abs(Math.round(b));
            while (b !== 0) {
              const t = b;
              b = a % b;
              a = t;
            }
            return a;
          };
          return { value: gcd(evalArgs[0], evalArgs[1]), isExact: true };
        }

        if (fn === "lcm") {
          if (evalArgs.length < 2) throw new Error("lcm requires 2 arguments");
          const a = Math.abs(Math.round(evalArgs[0]));
          const b = Math.abs(Math.round(evalArgs[1]));
          if (a === 0 || b === 0) return { value: 0, isExact: true };
          const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
          return { value: (a * b) / gcd(a, b), isExact: true };
        }

        if (fn === "ncr" || fn === "combinations") {
          const n = Math.round(evalArgs[0]);
          const r = Math.round(evalArgs[1]);
          if (r < 0 || r > n) return { value: 0, isExact: true };
          let res = 1;
          for (let i = 1; i <= r; i++) {
            res = (res * (n - i + 1)) / i;
          }
          return { value: Math.round(res), isExact: true };
        }

        if (fn === "npr" || fn === "permutations") {
          const n = Math.round(evalArgs[0]);
          const r = Math.round(evalArgs[1]);
          if (r < 0 || r > n) return { value: 0, isExact: true };
          let res = 1;
          for (let i = 0; i < r; i++) {
            res *= (n - i);
          }
          return { value: Math.round(res), isExact: true };
        }

        throw new Error(`Unknown function '${node.name}'`);
      }
    }

    throw new Error("Evaluation error: unsupported AST node");
  }

  public static toRadians(val: number, unit: AngleUnit = "deg"): number {
    if (unit === "rad") return val;
    if (unit === "grad") return (val * Math.PI) / 200;
    return (val * Math.PI) / 180;
  }

  public static fromRadians(rad: number, unit: AngleUnit = "deg"): number {
    if (unit === "rad") return rad;
    if (unit === "grad") return (rad * 200) / Math.PI;
    return (rad * 180) / Math.PI;
  }

  /**
   * Cleans floating point precision artifacts e.g. 0.1 + 0.2 => 0.3
   */
  public static cleanFloat(num: number): number {
    if (!Number.isFinite(num)) return num;
    // 12-decimal epsilon check
    const rounded = Number(num.toPrecision(12));
    return Math.abs(num - rounded) < 1e-12 ? rounded : num;
  }

  public static formatResult(
    val: number,
    precisionMode: string = "auto",
    format: "standard" | "scientific" | "engineering" = "standard"
  ): { display: string; exact: string; isApprox: boolean } {
    if (Number.isNaN(val)) return { display: "NaN", exact: "NaN", isApprox: false };
    if (!Number.isFinite(val)) return { display: val > 0 ? "Infinity" : "-Infinity", exact: String(val), isApprox: false };

    const cleaned = SafeEvaluator.cleanFloat(val);

    if (format === "scientific") {
      return { display: val.toExponential(4), exact: val.toExponential(), isApprox: true };
    }

    if (precisionMode !== "auto") {
      const decimals = parseInt(precisionMode, 10);
      if (!isNaN(decimals)) {
        return {
          display: val.toFixed(decimals),
          exact: String(cleaned),
          isApprox: !Number.isInteger(val),
        };
      }
    }

    // Auto mode: show clean integer or up to 10 decimal digits without trailing zeros
    const str = String(cleaned);
    const isApprox = !Number.isInteger(cleaned) && str.length > 8;

    return {
      display: str,
      exact: str,
      isApprox,
    };
  }
}

/**
 * Top-level convenience evaluation function
 */
export function evaluateExpression(
  expression: string,
  context: EvalContext = { variables: {}, angleUnit: "deg" }
): { value: number; display: string; exact?: string; isExact: boolean; error?: string } {
  try {
    const trimmed = expression.trim();
    if (!trimmed) {
      return { value: 0, display: "0", isExact: true };
    }
    const tokenizer = new Tokenizer(trimmed);
    const tokens = tokenizer.tokenize();
    const parser = new SafeParser(tokens);
    const ast = parser.parse();
    const evalRes = SafeEvaluator.evaluate(ast, context);
    const fmt = SafeEvaluator.formatResult(evalRes.value);
    return {
      value: evalRes.value,
      display: fmt.display,
      exact: evalRes.exactText || fmt.exact,
      isExact: evalRes.isExact ?? !fmt.isApprox,
    };
  } catch (err: any) {
    return {
      value: NaN,
      display: "Error",
      isExact: false,
      error: err.message || "Calculation Error",
    };
  }
}
