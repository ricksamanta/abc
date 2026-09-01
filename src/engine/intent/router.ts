/**
 * CalcRick Smart Universal Input & Intent Router
 * Converts natural queries into typed parameter objects and deterministic calculations
 * Follows PD-3 (Safe structured requests, no eval) & PD-4 (Single source of truth)
 */

import { evaluateExpression } from "@/engine/parser";
import { getCalculatorById } from "@/engine/registry";
import { CalculationResult } from "@/types";

export interface IntentMatch {
  type: "direct_calc" | "calculator_route" | "knowledge_route" | "ambiguous";
  calculatorId?: string;
  calculatorSlug?: string;
  calculatorName?: string;
  extractedInputs?: Record<string, any>;
  computedResult?: CalculationResult;
  directValue?: number;
  displayResult?: string;
  matchedConceptId?: string;
  confidence: number;
  candidateCalculators?: { id: string; name: string; description: string }[];
}

export function routeUniversalInput(query: string): IntentMatch {
  const q = query.trim();
  if (!q) {
    return { type: "ambiguous", confidence: 0 };
  }

  // 1. Check for GCD / HCF natural queries e.g. "GCD of 48 and 18", "gcd(48, 18)", "hcf of 12, 18"
  const gcdMatch = q.match(/(?:gcd|hcf|greatest\s+common\s+divisor)\s*(?:of|\()?[\s]*(\d+)[\s,and]+(\d+)\)?/i);
  if (gcdMatch) {
    const a = parseInt(gcdMatch[1], 10);
    const b = parseInt(gcdMatch[2], 10);
    const calc = getCalculatorById("gcd");
    if (calc) {
      const computed = calc.calculate({ a, b });
      return {
        type: "calculator_route",
        calculatorId: "gcd",
        calculatorSlug: "gcd",
        calculatorName: calc.name,
        extractedInputs: { a, b },
        computedResult: computed,
        displayResult: computed.displayResult,
        confidence: 0.98,
      };
    }
  }

  // 2. Check for LCM natural queries e.g. "LCM of 12 and 18", "lcm(15, 25)"
  const lcmMatch = q.match(/(?:lcm|least\s+common\s+multiple)\s*(?:of|\()?[\s]*(\d+)[\s,and]+(\d+)\)?/i);
  if (lcmMatch) {
    const a = parseInt(lcmMatch[1], 10);
    const b = parseInt(lcmMatch[2], 10);
    const calc = getCalculatorById("lcm");
    if (calc) {
      const computed = calc.calculate({ a, b });
      return {
        type: "calculator_route",
        calculatorId: "lcm",
        calculatorSlug: "lcm",
        calculatorName: calc.name,
        extractedInputs: { a, b },
        computedResult: computed,
        displayResult: computed.displayResult,
        confidence: 0.98,
      };
    }
  }

  // 3. Check for Quadratic equations e.g. "Solve x^2 + 5x + 6 = 0", "x^2 - 4x + 4 = 0"
  const quadMatch = q.match(/([+-]?\s*\d*)\s*x\^?2\s*([+-]\s*\d*)\s*x\s*([+-]\s*\d+)\s*=\s*0/i);
  if (quadMatch) {
    let aStr = quadMatch[1].replace(/\s+/g, "");
    let a = aStr === "" || aStr === "+" ? 1 : aStr === "-" ? -1 : parseFloat(aStr);
    let bStr = quadMatch[2].replace(/\s+/g, "");
    let b = bStr === "" || bStr === "+" ? 1 : bStr === "-" ? -1 : parseFloat(bStr);
    let c = parseFloat(quadMatch[3].replace(/\s+/g, ""));

    const calc = getCalculatorById("quadratic");
    if (calc && !isNaN(a) && !isNaN(b) && !isNaN(c)) {
      const computed = calc.calculate({ a, b, c });
      return {
        type: "calculator_route",
        calculatorId: "quadratic",
        calculatorSlug: "quadratic-equation",
        calculatorName: calc.name,
        extractedInputs: { a, b, c },
        computedResult: computed,
        displayResult: computed.displayResult,
        confidence: 0.95,
      };
    }
  }

  // 4. Check for Unit Conversions e.g. "Convert 10 km to miles", "100 C to F", "50 kg in lbs"
  const convertMatch = q.match(/(?:convert\s+)?([\d.]+)\s*([a-zA-Z°µ]+)\s*(?:to|in|into)\s*([a-zA-Z°µ]+)/i);
  if (convertMatch) {
    const val = parseFloat(convertMatch[1]);
    let fromU = convertMatch[2].replace("°", "");
    let toU = convertMatch[3].replace("°", "");

    // Quick normalizations
    if (fromU.toLowerCase() === "celsius") fromU = "C";
    if (toU.toLowerCase() === "fahrenheit") toU = "F";
    if (fromU.toLowerCase() === "km" || toU.toLowerCase() === "miles" || toU.toLowerCase() === "mi") {
      const calc = getCalculatorById("unit-converter");
      if (calc) {
        const computed = calc.calculate({ dimension: "length", value: val, fromUnit: fromU === "miles" ? "mi" : fromU, toUnit: toU === "miles" ? "mi" : toU });
        return {
          type: "calculator_route",
          calculatorId: "unit-converter",
          calculatorSlug: "unit-converter",
          calculatorName: calc.name,
          extractedInputs: { dimension: "length", value: val, fromUnit: fromU, toUnit: toU },
          computedResult: computed,
          displayResult: computed.displayResult,
          confidence: 0.95,
        };
      }
    }
  }

  // 5. Check for Loan / EMI queries e.g. "$500000 loan at 8.5% for 5 years", "loan 25000 at 6% 3 yrs"
  const loanMatch = q.match(/(?:[$₹€£]?\s*)(\d[\d,]*)\s*(?:loan)?\s*(?:at)?\s*([\d.]+)%\s*(?:for)?\s*(\d+)\s*(?:years|yrs|year)/i);
  if (loanMatch) {
    const principal = parseFloat(loanMatch[1].replace(/,/g, ""));
    const rate = parseFloat(loanMatch[2]);
    const years = parseInt(loanMatch[3], 10);
    const calc = getCalculatorById("loan-emi");
    if (calc) {
      const computed = calc.calculate({ principal, rate, years });
      return {
        type: "calculator_route",
        calculatorId: "loan-emi",
        calculatorSlug: "loan-emi",
        calculatorName: calc.name,
        extractedInputs: { principal, rate, years },
        computedResult: computed,
        displayResult: computed.displayResult,
        confidence: 0.95,
      };
    }
  }

  // 6. Check for Chemical Molar Mass e.g. "molar mass of H2O", "molar mass of C6H12O6"
  const molarMatch = q.match(/(?:molar\s+mass|molecular\s+weight)\s*(?:of)?\s*([A-Za-z0-9]+)/i);
  if (molarMatch) {
    const formula = molarMatch[1];
    const calc = getCalculatorById("molar-mass");
    if (calc) {
      const computed = calc.calculate({ formula });
      return {
        type: "calculator_route",
        calculatorId: "molar-mass",
        calculatorSlug: "molar-mass",
        calculatorName: calc.name,
        extractedInputs: { formula },
        computedResult: computed,
        displayResult: computed.displayResult,
        confidence: 0.96,
      };
    }
  }

  // 7. Check for IPv4 CIDR e.g. "192.168.1.50/24", "subnet 10.0.0.1/16"
  const ipMatch = q.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})/);
  if (ipMatch) {
    const ip = ipMatch[1];
    const cidr = parseInt(ipMatch[2], 10);
    const calc = getCalculatorById("ipv4-subnet");
    if (calc) {
      const computed = calc.calculate({ ip, cidr });
      return {
        type: "calculator_route",
        calculatorId: "ipv4-subnet",
        calculatorSlug: "ipv4-subnet",
        calculatorName: calc.name,
        extractedInputs: { ip, cidr },
        computedResult: computed,
        displayResult: computed.displayResult,
        confidence: 0.97,
      };
    }
  }

  // 8. Default: Try direct evaluation in Safe Expression Parser (e.g. "2+3*4", "sin(45)", "sqrt(256)")
  const directEval = evaluateExpression(q);
  if (!directEval.error && !isNaN(directEval.value) && Number.isFinite(directEval.value)) {
    return {
      type: "direct_calc",
      directValue: directEval.value,
      displayResult: directEval.display,
      confidence: 0.9,
    };
  }

  // Fallback: candidate calculators based on keywords
  return {
    type: "ambiguous",
    confidence: 0.2,
    candidateCalculators: [
      { id: "standard-calculator", name: "Standard & Scientific Calculator", description: "General expression evaluation and arithmetic" },
      { id: "gcd", name: "GCD & Euclidean Algorithm", description: "Compute greatest common factors" },
      { id: "quadratic", name: "Quadratic Equation Solver", description: "Solve polynomial second-degree equations" },
      { id: "unit-converter", name: "Universal Unit Converter", description: "Convert length, mass, temperature, and storage" },
      { id: "loan-emi", name: "Loan EMI & Mortgage", description: "Monthly payments and interest calculation" },
    ],
  };
}
