/**
 * CalcRick Knowledge & Learning Ecosystem
 * Formulas, Rules, Theorems, Laws, Concepts & Practice Questions
 */

import { KnowledgeItem, PracticeQuestion } from "@/types";

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  // 1. GCD / Euclidean Algorithm Concept
  {
    id: "gcd-concept",
    slug: "greatest-common-divisor",
    title: "Greatest Common Divisor (GCD / HCF)",
    type: "concept",
    category: "number-theory",
    domain: "mathematics",
    summary: "The greatest positive integer that divides two or more integers without leaving a remainder.",
    statement: "For integers a and b not both zero, gcd(a, b) is the largest integer d such that d|a and d|b.",
    conditions: ["Applies to integers a, b (at least one non-zero).", "GCD is always positive."],
    whenToUse: "Simplifying fractions, finding common periods, solving linear Diophantine equations ax + by = c, and modular arithmetic.",
    derivationOrWhy: "The Euclidean Algorithm computes GCD in logarithmic steps O(log(min(a,b))) by noting that gcd(a, b) = gcd(b, a mod b).",
    workedExample: {
      problem: "Find GCD(48, 18)",
      given: "a = 48, b = 18",
      solutionSteps: [
        "48 ÷ 18 = 2 with remainder 12 (48 = 18 × 2 + 12)",
        "18 ÷ 12 = 1 with remainder 6 (18 = 12 × 1 + 6)",
        "12 ÷ 6 = 2 with remainder 0 (12 = 6 × 2 + 0)",
      ],
      answer: "The last non-zero remainder is 6.",
    },
    linkedCalculatorId: "gcd",
    tags: ["gcd", "hcf", "euclidean", "factors", "arithmetic"],
  },

  // 2. Pythagorean Theorem
  {
    id: "pythagorean-theorem-concept",
    slug: "pythagorean-theorem",
    title: "Pythagorean Theorem",
    type: "theorem",
    category: "geometry",
    domain: "mathematics",
    summary: "In any right-angled triangle, the area of the square whose side is the hypotenuse equals the sum of areas of the squares on the other two sides.",
    latex: "a^2 + b^2 = c^2",
    statement: "For any right triangle with perpendicular legs a and b and hypotenuse c: a² + b² = c².",
    conditions: ["Triangle MUST have a strictly 90° right angle.", "c is always the side opposite the 90° angle (longest side)."],
    variables: [
      { symbol: "a", meaning: "Length of first leg" },
      { symbol: "b", meaning: "Length of second leg" },
      { symbol: "c", meaning: "Length of hypotenuse" },
    ],
    whenToUse: "Calculating diagonal distances, coordinate geometry distance formula d = √((x₂-x₁)² + (y₂-y₁)²), and 3D space vectors.",
    workedExample: {
      problem: "Find hypotenuse for legs a = 6 and b = 8",
      solutionSteps: [
        "c² = a² + b² = 6² + 8²",
        "c² = 36 + 64 = 100",
        "c = √100 = 10",
      ],
      answer: "c = 10",
    },
    linkedCalculatorId: "pythagorean-solver",
    tags: ["pythagoras", "right triangle", "geometry", "hypotenuse"],
  },

  // 3. Quadratic Formula
  {
    id: "quadratic-formula-concept",
    slug: "quadratic-formula",
    title: "Quadratic Formula & Discriminant",
    type: "formula",
    category: "algebra",
    domain: "mathematics",
    summary: "The algebraic formula providing closed-form solutions to any second-degree polynomial equation ax² + bx + c = 0.",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    conditions: ["a ≠ 0 (if a = 0 the equation is linear bx + c = 0)."],
    variables: [
      { symbol: "a", meaning: "Coefficient of quadratic term x²" },
      { symbol: "b", meaning: "Coefficient of linear term x" },
      { symbol: "c", meaning: "Constant term" },
    ],
    derivationOrWhy: "Derived by completing the square on ax² + bx + c = 0.",
    commonMistakes: [
      "Forgetting the negative sign on -b when b itself is negative.",
      "Dividing only the square root part by 2a instead of the entire numerator.",
    ],
    linkedCalculatorId: "quadratic",
    tags: ["quadratic", "roots", "algebra", "discriminant", "parabola"],
  },

  // 4. Newton's Second Law of Motion
  {
    id: "newton-second-law-formula",
    slug: "newtons-second-law",
    title: "Newton's Second Law of Motion",
    type: "law",
    category: "physics-mechanics",
    domain: "science",
    summary: "The net external force on an object is equal to the rate of change of its linear momentum, expressed as F = ma for constant mass.",
    latex: "F_{\\text{net}} = m \\times a",
    variables: [
      { symbol: "F", meaning: "Net force vector", unit: "Newtons (N = kg·m/s²)" },
      { symbol: "m", meaning: "Inertial mass", unit: "kilograms (kg)" },
      { symbol: "a", meaning: "Acceleration", unit: "m/s²" },
    ],
    conditions: ["Valid in inertial reference frames.", "Speeds well below speed of light (non-relativistic)."],
    linkedCalculatorId: "force-newton",
    tags: ["physics", "newton", "force", "acceleration", "mechanics"],
  },

  // 5. Ohm's Law
  {
    id: "ohms-law-concept",
    slug: "ohms-law",
    title: "Ohm's Law (V = IR)",
    type: "law",
    category: "physics-electricity",
    domain: "science",
    summary: "The direct proportional relationship between electric potential difference (voltage) and electric current in an ohmic conductor.",
    latex: "V = I \\times R",
    variables: [
      { symbol: "V", meaning: "Voltage (Potential Difference)", unit: "Volts (V)" },
      { symbol: "I", meaning: "Electric Current", unit: "Amperes (A)" },
      { symbol: "R", meaning: "Resistance", unit: "Ohms (Ω)" },
    ],
    conditions: ["Temperature and physical conductor properties remain constant (ohmic regime)."],
    linkedCalculatorId: "ohms-law",
    tags: ["electricity", "ohm", "voltage", "current", "circuits"],
  },

  // 6. Compound Interest & Time Value of Money
  {
    id: "compound-interest-concept",
    slug: "compound-interest-law",
    title: "Compound Interest & Exponential Growth",
    type: "concept",
    category: "finance",
    domain: "finance",
    summary: "Interest calculated on the initial principal and on the accumulated interest of previous periods.",
    latex: "A = P \\left(1 + \\frac{r}{n}\\right)^{nt}",
    variables: [
      { symbol: "P", meaning: "Principal Amount" },
      { symbol: "r", meaning: "Annual Nominal Interest Rate" },
      { symbol: "n", meaning: "Compounding frequency per year" },
      { symbol: "t", meaning: "Time in years" },
    ],
    linkedCalculatorId: "compound-interest",
    tags: ["finance", "interest", "cagr", "future value", "growth"],
  },

  // 7. Order of Operations (PEMDAS / BODMAS)
  {
    id: "order-of-operations-rule",
    slug: "order-of-operations",
    title: "Order of Operations (PEMDAS / BODMAS)",
    type: "rule",
    category: "arithmetic",
    domain: "mathematics",
    summary: "The standard operator precedence rule specifying the hierarchy of mathematical operations.",
    statement: "1. Parentheses / Brackets → 2. Exponents / Orders → 3. Multiplication & Division (left-to-right) → 4. Addition & Subtraction (left-to-right).",
    conditions: ["Multiplication and Division have equal precedence and are evaluated from left to right.", "Addition and Subtraction have equal precedence and are evaluated from left to right."],
    workedExample: {
      problem: "Evaluate 2 + 3 × 4",
      solutionSteps: [
        "Multiplication takes precedence over addition: 3 × 4 = 12",
        "Add: 2 + 12 = 14",
      ],
      answer: "14 (Note: NOT 20)",
    },
    linkedCalculatorId: "standard-calculator",
    tags: ["pemdas", "bodmas", "precedence", "arithmetic", "operations"],
  },
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "pq-gcd-1",
    topic: "Greatest Common Divisor",
    domain: "mathematics",
    difficulty: "easy",
    question: "Find the greatest common divisor (GCD) of 36 and 24.",
    correctAnswer: 12,
    explanation: "Divisors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36. Divisors of 24 are 1, 2, 3, 4, 6, 8, 12, 24. The greatest shared divisor is 12.",
    steps: [
      "36 ÷ 24 = 1 remainder 12 (36 = 24 × 1 + 12)",
      "24 ÷ 12 = 2 remainder 0 (24 = 12 × 2 + 0)",
      "Last non-zero remainder = 12",
    ],
    hints: ["Try dividing 36 by 24 and finding the remainder.", "Use the Euclidean algorithm."],
    relatedCalculatorId: "gcd",
    relatedConceptId: "gcd-concept",
  },
  {
    id: "pq-quad-1",
    topic: "Quadratic Equations",
    domain: "mathematics",
    difficulty: "medium",
    question: "Solve for the roots of x² - 7x + 10 = 0. What is the larger root?",
    correctAnswer: 5,
    explanation: "Factor (x - 2)(x - 5) = 0 gives roots x = 2 and x = 5. The larger root is 5.",
    steps: [
      "Identify a = 1, b = -7, c = 10",
      "Δ = (-7)² - 4(1)(10) = 49 - 40 = 9",
      "x = (7 ± √9) / 2 = (7 ± 3) / 2",
      "x₁ = (7 + 3) / 2 = 5,  x₂ = (7 - 3) / 2 = 2",
    ],
    hints: ["Find two numbers that multiply to 10 and add to 7.", "Discriminant Δ = b² - 4ac = 9."],
    relatedCalculatorId: "quadratic",
    relatedConceptId: "quadratic-formula-concept",
  },
  {
    id: "pq-pyth-1",
    topic: "Pythagorean Theorem",
    domain: "mathematics",
    difficulty: "easy",
    question: "In a right triangle with legs of length 9 cm and 12 cm, what is the length of the hypotenuse (in cm)?",
    correctAnswer: 15,
    unit: "cm",
    explanation: "c = √(9² + 12²) = √(81 + 144) = √225 = 15 cm.",
    steps: [
      "c² = a² + b² = 9² + 12²",
      "c² = 81 + 144 = 225",
      "c = √225 = 15 cm",
    ],
    hints: ["Use a² + b² = c².", "Notice this is a 3-4-5 triangle scaled by 3!"],
    relatedCalculatorId: "pythagorean-solver",
    relatedConceptId: "pythagorean-theorem-concept",
  },
  {
    id: "pq-force-1",
    topic: "Newton's 2nd Law",
    domain: "science",
    difficulty: "easy",
    question: "A net force accelerates a 15 kg object at 4 m/s². What is the magnitude of the force in Newtons?",
    correctAnswer: 60,
    unit: "N",
    explanation: "F = m × a = 15 kg × 4 m/s² = 60 N.",
    steps: [
      "Formula: F = m × a",
      "Substitution: F = 15 × 4 = 60 N",
    ],
    hints: ["Multiply mass by acceleration."],
    relatedCalculatorId: "force-newton",
    relatedConceptId: "newton-second-law-formula",
  },
  {
    id: "pq-ohm-1",
    topic: "Ohm's Law",
    domain: "science",
    difficulty: "easy",
    question: "A 9V battery connects across an 18Ω resistor. What current (in Amperes) flows through the circuit?",
    correctAnswer: 0.5,
    unit: "A",
    explanation: "I = V / R = 9V / 18Ω = 0.5 Amperes.",
    steps: [
      "Formula: I = V ÷ R",
      "I = 9 ÷ 18 = 0.5 A",
    ],
    hints: ["Rearrange V = I × R to solve for I."],
    relatedCalculatorId: "ohms-law",
    relatedConceptId: "ohms-law-concept",
  },
  {
    id: "pq-cidr-1",
    topic: "IPv4 Subnetting",
    domain: "programming",
    difficulty: "medium",
    question: "How many total usable host IP addresses are available in a /26 IPv4 subnet?",
    correctAnswer: 62,
    explanation: "A /26 network leaves 32 - 26 = 6 host bits. Total IPs = 2⁶ = 64. Usable hosts = 64 - 2 = 62.",
    steps: [
      "Host bits = 32 - 26 = 6 bits",
      "Total addresses = 2⁶ = 64",
      "Minus 2 (Network & Broadcast) = 62 usable hosts",
    ],
    hints: ["Formula: 2^(32 - CIDR) - 2.", "Calculate 2⁶ - 2."],
    relatedCalculatorId: "ipv4-subnet",
  },
];

export function getKnowledgeById(id: string): KnowledgeItem | undefined {
  return KNOWLEDGE_ITEMS.find((k) => k.id === id || k.slug === id);
}

export function searchKnowledge(query: string): KnowledgeItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return KNOWLEDGE_ITEMS;
  return KNOWLEDGE_ITEMS.filter(
    (k) =>
      k.title.toLowerCase().includes(q) ||
      k.summary.toLowerCase().includes(q) ||
      k.category.toLowerCase().includes(q) ||
      k.tags.some((t) => t.toLowerCase().includes(q))
  );
}
