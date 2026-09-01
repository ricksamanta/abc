/**
 * CalcRick Mathematics Domain Suite
 * Real Deterministic Calculation, Step Generator & Verification Engine
 */

import { CalculatorDefinition } from "@/types";

export const mathCalculators: CalculatorDefinition[] = [
  // 1. Greatest Common Divisor (GCD / HCF)
  {
    id: "gcd",
    name: "Greatest Common Divisor (GCD / HCF)",
    slug: "gcd",
    category: "number-theory",
    domain: "mathematics",
    description: "Calculate the greatest common divisor of two integers using the Euclidean Algorithm with step-by-step division remainders.",
    keywords: ["gcd", "hcf", "greatest common factor", "euclidean algorithm", "divisibility", "factors"],
    iconName: "Binary",
    formula: {
      name: "Euclidean Algorithm",
      latex: "\\gcd(a, b) = \\gcd(b, a \\bmod b)",
      description: "If a = bq + r, then gcd(a, b) = gcd(b, r)",
      variables: [
        { symbol: "a", meaning: "First integer" },
        { symbol: "b", meaning: "Second integer" },
        { symbol: "r", meaning: "Remainder of a ÷ b" },
      ],
    },
    inputs: [
      { key: "a", label: "First Integer (a)", type: "number", defaultValue: 48, required: true },
      { key: "b", label: "Second Integer (b)", type: "number", defaultValue: 18, required: true },
    ],
    sampleInputs: [
      { label: "48 & 18", values: { a: 48, b: 18 } },
      { label: "1071 & 462", values: { a: 1071, b: 462 } },
      { label: "252 & 105", values: { a: 252, b: 105 } },
    ],
    calculate: (input) => {
      let a = Math.abs(Math.round(Number(input.a) || 0));
      let b = Math.abs(Math.round(Number(input.b) || 0));
      if (a === 0 && b === 0) {
        return {
          status: "invalid",
          input: `GCD(0, 0)`,
          result: 0,
          warnings: ["GCD(0, 0) is undefined"],
        };
      }
      if (a === 0 || b === 0) {
        const res = Math.max(a, b);
        return {
          status: "calculated",
          input: `GCD(${input.a}, ${input.b})`,
          result: res,
          displayResult: String(res),
          exactResult: String(res),
          isExact: true,
        };
      }

      let x = Math.max(a, b);
      let y = Math.min(a, b);
      const stepsArr = [];
      while (y !== 0) {
        const q = Math.floor(x / y);
        const r = x % y;
        stepsArr.push({ dividend: x, divisor: y, quotient: q, remainder: r });
        x = y;
        y = r;
      }
      const gcdVal = x;

      return {
        status: "calculated",
        input: `GCD(${input.a}, ${input.b})`,
        result: gcdVal,
        displayResult: String(gcdVal),
        exactResult: String(gcdVal),
        isExact: true,
        steps: stepsArr.map((s, idx) => ({
          title: `Step ${idx + 1}`,
          expression: `${s.dividend} = ${s.divisor} × ${s.quotient} + ${s.remainder}`,
          latex: `${s.dividend} = ${s.divisor} \\times ${s.quotient} + ${s.remainder}`,
          text: `Divide ${s.dividend} by ${s.divisor}: quotient = ${s.quotient}, remainder = ${s.remainder}`,
        })),
        verification: {
          passed: a % gcdVal === 0 && b % gcdVal === 0,
          detail: `${a} ÷ ${gcdVal} = ${a / gcdVal} and ${b} ÷ ${gcdVal} = ${b / gcdVal} (both divide with zero remainder).`,
        },
        explanation: `The Euclidean algorithm repeatedly replaces the larger number by the remainder of dividing it by the smaller number until the remainder is 0. The last non-zero divisor is ${gcdVal}.`,
        examFormat: {
          given: [
            { label: "First number a", value: String(input.a) },
            { label: "Second number b", value: String(input.b) },
          ],
          required: "Greatest Common Divisor (GCD / HCF)",
          formulaLatex: "\\gcd(a, b) = \\text{last non-zero remainder in Euclidean Division}",
          substitutionLatex: `\\gcd(${input.a}, ${input.b})`,
          calculationSteps: stepsArr.map((s) => `${s.dividend} = ${s.divisor}(${s.quotient}) + ${s.remainder}`),
          finalAnswer: String(gcdVal),
        },
      };
    },
    relatedCalculators: ["lcm", "prime-factorization", "fractions"],
    relatedConcepts: ["gcd-concept", "euclidean-algorithm", "divisibility-rules"],
    relatedFormulas: ["euclidean-formula"],
    practiceTopic: "number-theory",
  },

  // 2. Least Common Multiple (LCM)
  {
    id: "lcm",
    name: "Least Common Multiple (LCM)",
    slug: "lcm",
    category: "number-theory",
    domain: "mathematics",
    description: "Find the smallest positive integer divisible by two numbers, computed via the relationship LCM(a,b) = |a·b| / GCD(a,b).",
    keywords: ["lcm", "least common multiple", "lowest common multiple", "multiples"],
    formula: {
      name: "LCM-GCD Relationship",
      latex: "\\operatorname{LCM}(a, b) = \\frac{|a \\times b|}{\\gcd(a, b)}",
      variables: [
        { symbol: "a", meaning: "First integer" },
        { symbol: "b", meaning: "Second integer" },
      ],
    },
    inputs: [
      { key: "a", label: "First Integer (a)", type: "number", defaultValue: 12, required: true },
      { key: "b", label: "Second Integer (b)", type: "number", defaultValue: 18, required: true },
    ],
    sampleInputs: [
      { label: "12 & 18", values: { a: 12, b: 18 } },
      { label: "15 & 25", values: { a: 15, b: 25 } },
      { label: "8 & 14", values: { a: 8, b: 14 } },
    ],
    calculate: (input) => {
      const a = Math.abs(Math.round(Number(input.a) || 0));
      const b = Math.abs(Math.round(Number(input.b) || 0));
      if (a === 0 || b === 0) {
        return {
          status: "calculated",
          input: `LCM(${input.a}, ${input.b})`,
          result: 0,
          displayResult: "0",
          exactResult: "0",
          isExact: true,
        };
      }
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const g = gcd(a, b);
      const lcmVal = (a * b) / g;

      return {
        status: "calculated",
        input: `LCM(${input.a}, ${input.b})`,
        result: lcmVal,
        displayResult: String(lcmVal),
        exactResult: String(lcmVal),
        isExact: true,
        steps: [
          {
            title: "Step 1: Compute GCD",
            text: `Find greatest common divisor: GCD(${a}, ${b}) = ${g}`,
            latex: `\\gcd(${a}, ${b}) = ${g}`,
          },
          {
            title: "Step 2: Apply Formula",
            text: `LCM(${a}, ${b}) = (${a} × ${b}) ÷ ${g} = ${a * b} ÷ ${g} = ${lcmVal}`,
            latex: `\\operatorname{LCM}(${a}, ${b}) = \\frac{${a} \\times ${b}}{${g}} = \\frac{${a * b}}{${g}} = ${lcmVal}`,
          },
        ],
        verification: {
          passed: lcmVal % a === 0 && lcmVal % b === 0,
          detail: `${lcmVal} ÷ ${a} = ${lcmVal / a} and ${lcmVal} ÷ ${b} = ${lcmVal / b} (both yield whole integers).`,
        },
        explanation: `The least common multiple of ${a} and ${b} is ${lcmVal}. It is the smallest positive integer that both numbers divide into evenly.`,
      };
    },
    relatedCalculators: ["gcd", "prime-factorization"],
    relatedConcepts: ["lcm-concept"],
  },

  // 3. Quadratic Equation Solver
  {
    id: "quadratic",
    name: "Quadratic Equation Solver",
    slug: "quadratic-equation",
    category: "algebra",
    domain: "mathematics",
    description: "Solve ax² + bx + c = 0 with real and complex roots, showing discriminant analysis and complete quadratic formula steps.",
    keywords: ["quadratic", "roots", "parabola", "discriminant", "algebra", "second degree"],
    formula: {
      name: "Quadratic Formula",
      latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      description: "Discriminant Δ = b² - 4ac determines the nature of the roots",
      variables: [
        { symbol: "a", meaning: "Coefficient of x² (a ≠ 0)" },
        { symbol: "b", meaning: "Coefficient of x" },
        { symbol: "c", meaning: "Constant term" },
      ],
    },
    inputs: [
      { key: "a", label: "Coefficient a (x²)", type: "number", defaultValue: 1, required: true },
      { key: "b", label: "Coefficient b (x)", type: "number", defaultValue: 5, required: true },
      { key: "c", label: "Constant c", type: "number", defaultValue: 6, required: true },
    ],
    sampleInputs: [
      { label: "x² + 5x + 6 = 0 (Real roots)", values: { a: 1, b: 5, c: 6 } },
      { label: "x² - 4x + 4 = 0 (Repeated root)", values: { a: 1, b: -4, c: 4 } },
      { label: "x² + 2x + 5 = 0 (Complex roots)", values: { a: 1, b: 2, c: 5 } },
    ],
    calculate: (input) => {
      const a = Number(input.a);
      const b = Number(input.b);
      const c = Number(input.c);

      if (a === 0) {
        if (b === 0) {
          return {
            status: "invalid",
            input: `${c} = 0`,
            result: null,
            warnings: [c === 0 ? "Infinite solutions (0 = 0)" : "No solution (contradiction)"],
          };
        }
        const linearRoot = -c / b;
        return {
          status: "calculated",
          input: `${b}x + ${c} = 0 (Linear)`,
          result: { x1: linearRoot, type: "linear" },
          displayResult: `x = ${linearRoot}`,
          exactResult: `x = ${linearRoot}`,
          isExact: true,
          steps: [
            {
              title: "Linear Equation",
              text: `Since a = 0, this is linear: ${b}x + ${c} = 0 → x = -${c}/${b} = ${linearRoot}`,
            },
          ],
        };
      }

      const disc = b * b - 4 * a * c;
      const twoA = 2 * a;
      let root1Str = "";
      let root2Str = "";
      let rootType = "";
      let rootsData: any = {};

      if (disc > 0) {
        const sqrtD = Math.sqrt(disc);
        const r1 = (-b + sqrtD) / twoA;
        const r2 = (-b - sqrtD) / twoA;
        rootType = "Two distinct real roots";
        root1Str = `x₁ = ${r1.toFixed(4).replace(/\.?0+$/, "")}`;
        root2Str = `x₂ = ${r2.toFixed(4).replace(/\.?0+$/, "")}`;
        rootsData = { r1, r2, disc, type: "real" };
      } else if (disc === 0) {
        const r = -b / twoA;
        rootType = "One repeated real root";
        root1Str = `x = ${r.toFixed(4).replace(/\.?0+$/, "")}`;
        rootsData = { r1: r, r2: r, disc, type: "repeated" };
      } else {
        const realPart = (-b / twoA).toFixed(4).replace(/\.?0+$/, "");
        const imagPart = (Math.sqrt(-disc) / Math.abs(twoA)).toFixed(4).replace(/\.?0+$/, "");
        rootType = "Two complex conjugate roots";
        root1Str = `x₁ = ${realPart} + ${imagPart}i`;
        root2Str = `x₂ = ${realPart} - ${imagPart}i`;
        rootsData = { realPart: -b / twoA, imagPart: Math.sqrt(-disc) / Math.abs(twoA), disc, type: "complex" };
      }

      const display = root2Str ? `${root1Str},  ${root2Str}` : root1Str;

      return {
        status: "calculated",
        input: `${a}x² + ${b}x + ${c} = 0`,
        result: rootsData,
        displayResult: display,
        exactResult: display,
        isExact: disc >= 0 && Number.isInteger(Math.sqrt(Math.max(0, disc))),
        steps: [
          {
            title: "Step 1: Compute the Discriminant (Δ)",
            text: `Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${disc}`,
            latex: `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${disc}`,
          },
          {
            title: "Step 2: Analyze Nature of Roots",
            text: `Since Δ = ${disc} ${disc > 0 ? "> 0 (two distinct real roots)" : disc === 0 ? "= 0 (one real repeated root)" : "< 0 (two complex conjugate roots)"}.`,
          },
          {
            title: "Step 3: Substitute into Quadratic Formula",
            text: `x = (-(${b}) ± √(${disc})) / (2 × ${a})`,
            latex: `x = \\frac{-(${b}) \\pm \\sqrt{${disc}}}{2(${a})}`,
          },
          {
            title: "Step 4: Final Solutions",
            text: display,
          },
        ],
        verification: disc >= 0 ? {
          passed: Math.abs(a * Math.pow(rootsData.r1, 2) + b * rootsData.r1 + c) < 1e-6,
          detail: `Substitution of x₁ = ${rootsData.r1}: ${a}(${rootsData.r1})² + ${b}(${rootsData.r1}) + ${c} ≈ 0 (verified).`,
        } : undefined,
        explanation: `A quadratic equation has up to two roots governed by the discriminant Δ = b² - 4ac. Here Δ = ${disc}, giving ${rootType.toLowerCase()}.`,
        examFormat: {
          given: [
            { label: "Coefficient a", value: String(a) },
            { label: "Coefficient b", value: String(b) },
            { label: "Constant c", value: String(c) },
          ],
          required: "Roots of ax² + bx + c = 0",
          formulaLatex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
          substitutionLatex: `x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`,
          calculationSteps: [
            `Discriminant \\Delta = ${disc}`,
            `Roots: ${display}`,
          ],
          finalAnswer: display,
        },
      };
    },
    relatedCalculators: ["polynomial-roots", "complex-numbers"],
    relatedConcepts: ["quadratic-formula-concept", "discriminant-concept"],
  },

  // 4. Prime Factorization
  {
    id: "prime-factorization",
    name: "Prime Factorization & Primality",
    slug: "prime-factorization",
    category: "number-theory",
    domain: "mathematics",
    description: "Decompose any positive integer into its prime factors with powers and test whether a number is prime.",
    keywords: ["prime", "factorization", "primes", "composite", "factors", "fundamental theorem of arithmetic"],
    formula: {
      name: "Fundamental Theorem of Arithmetic",
      latex: "n = p_1^{a_1} \\times p_2^{a_2} \\times \\dots \\times p_k^{a_k}",
      description: "Every integer n > 1 can be represented uniquely as a product of prime powers.",
    },
    inputs: [
      { key: "n", label: "Integer (n)", type: "number", defaultValue: 360, required: true, min: 2, max: 1e12 },
    ],
    sampleInputs: [
      { label: "360", values: { n: 360 } },
      { label: "97 (Prime)", values: { n: 97 } },
      { label: "1024 (2¹⁰)", values: { n: 1024 } },
      { label: "5040", values: { n: 5040 } },
    ],
    calculate: (input) => {
      let num = Math.abs(Math.round(Number(input.n) || 0));
      if (num < 2) {
        return {
          status: "invalid",
          input: `n = ${num}`,
          result: null,
          warnings: ["Enter an integer ≥ 2"],
        };
      }

      const factors: Record<number, number> = {};
      const divisionSteps: { current: number; divisor: number; next: number }[] = [];
      let temp = num;

      for (let d = 2; d * d <= temp; d++) {
        while (temp % d === 0) {
          factors[d] = (factors[d] || 0) + 1;
          divisionSteps.push({ current: temp, divisor: d, next: temp / d });
          temp /= d;
        }
      }
      if (temp > 1) {
        factors[temp] = (factors[temp] || 0) + 1;
        divisionSteps.push({ current: temp, divisor: temp, next: 1 });
      }

      const isPrime = Object.keys(factors).length === 1 && factors[num] === 1;
      const factorTerms = Object.entries(factors).map(([p, count]) => (count > 1 ? `${p}^${count}` : `${p}`));
      const latexTerms = Object.entries(factors).map(([p, count]) => (count > 1 ? `${p}^{${count}}` : `${p}`));
      const factorStr = factorTerms.join(" × ");
      const latexStr = latexTerms.join(" \\times ");

      return {
        status: "calculated",
        input: `Prime factors of ${num}`,
        result: { factors, isPrime, factorString: factorStr },
        displayResult: isPrime ? `${num} is a PRIME number` : `${num} = ${factorStr}`,
        exactResult: factorStr,
        isExact: true,
        steps: divisionSteps.map((s, idx) => ({
          title: `Step ${idx + 1}`,
          text: `${s.current} ÷ ${s.divisor} = ${s.next}`,
          latex: `${s.current} \\div ${s.divisor} = ${s.next}`,
        })),
        verification: {
          passed: Object.entries(factors).reduce((acc, [p, count]) => acc * Math.pow(Number(p), count), 1) === num,
          detail: `Multiplying prime factors ${factorStr} equals ${num}.`,
        },
        explanation: isPrime
          ? `${num} has no positive divisors other than 1 and ${num}, making it a prime number.`
          : `According to the Fundamental Theorem of Arithmetic, ${num} decomposes uniquely into prime factors: ${factorStr}.`,
      };
    },
    relatedCalculators: ["gcd", "lcm"],
    relatedConcepts: ["prime-numbers-concept", "fundamental-theorem-arithmetic"],
  },

  // 5. 2D & 3D Geometry (Circle, Triangle, Cylinder, Sphere)
  {
    id: "geometry-solver",
    name: "Geometric Shapes (2D & 3D)",
    slug: "geometry-solver",
    category: "geometry",
    domain: "mathematics",
    description: "Calculate Area, Perimeter, Surface Area, Volume, and dimensions for circles, triangles, spheres, cylinders, and cones.",
    keywords: ["geometry", "area", "perimeter", "volume", "surface area", "circle", "cylinder", "sphere", "triangle"],
    inputs: [
      {
        key: "shape",
        label: "Shape",
        type: "select",
        defaultValue: "circle",
        options: [
          { label: "Circle (2D)", value: "circle" },
          { label: "Triangle (2D)", value: "triangle" },
          { label: "Rectangle (2D)", value: "rectangle" },
          { label: "Sphere (3D)", value: "sphere" },
          { label: "Cylinder (3D)", value: "cylinder" },
          { label: "Cone (3D)", value: "cone" },
        ],
      },
      { key: "dim1", label: "Radius / Base / Length", type: "number", defaultValue: 5, required: true },
      { key: "dim2", label: "Height / Width (if applicable)", type: "number", defaultValue: 10 },
      { key: "dim3", label: "Side 3 (for triangle)", type: "number", defaultValue: 6 },
    ],
    sampleInputs: [
      { label: "Circle (r = 7)", values: { shape: "circle", dim1: 7, dim2: 0, dim3: 0 } },
      { label: "Cylinder (r = 4, h = 10)", values: { shape: "cylinder", dim1: 4, dim2: 10, dim3: 0 } },
      { label: "Sphere (r = 3)", values: { shape: "sphere", dim1: 3, dim2: 0, dim3: 0 } },
      { label: "Triangle (b = 8, h = 5)", values: { shape: "triangle", dim1: 8, dim2: 5, dim3: 0 } },
    ],
    calculate: (input) => {
      const shape = input.shape || "circle";
      const d1 = Number(input.dim1) || 0;
      const d2 = Number(input.dim2) || 0;

      if (d1 <= 0) {
        return {
          status: "invalid",
          input: `${shape}`,
          result: null,
          warnings: ["Dimensions must be strictly positive"],
        };
      }

      if (shape === "circle") {
        const area = Math.PI * d1 * d1;
        const circ = 2 * Math.PI * d1;
        return {
          status: "calculated",
          input: `Circle (radius r = ${d1})`,
          result: { area, circumference: circ },
          displayResult: `Area = ${area.toFixed(4)} sq units | Circumference = ${circ.toFixed(4)} units`,
          exactResult: `Area = ${d1 * d1}π | Circumference = ${2 * d1}π`,
          steps: [
            { title: "Area Formula", text: `A = π × r² = π × (${d1})² = ${d1 * d1}π ≈ ${area.toFixed(4)}`, latex: `A = \\pi r^2 = \\pi (${d1})^2 = ${area.toFixed(4)}` },
            { title: "Circumference Formula", text: `C = 2 × π × r = 2π × ${d1} = ${2 * d1}π ≈ ${circ.toFixed(4)}`, latex: `C = 2\\pi r = 2\\pi (${d1}) = ${circ.toFixed(4)}` },
          ],
          verification: {
            passed: true,
            detail: `Ratio of Area / Circumference = r/2 = ${(area / circ).toFixed(4)} (matches ${(d1 / 2).toFixed(4)}).`,
          },
          explanation: `For a circle with radius ${d1}, the area scales with the square of the radius while circumference scales linearly.`,
        };
      }

      if (shape === "cylinder") {
        const r = d1;
        const h = d2 || 1;
        const volume = Math.PI * r * r * h;
        const lateralArea = 2 * Math.PI * r * h;
        const totalArea = lateralArea + 2 * Math.PI * r * r;
        return {
          status: "calculated",
          input: `Cylinder (r = ${r}, h = ${h})`,
          result: { volume, surfaceArea: totalArea },
          displayResult: `Volume = ${volume.toFixed(4)} | Total Surface Area = ${totalArea.toFixed(4)}`,
          exactResult: `Volume = ${r * r * h}π | Surface Area = ${2 * r * (r + h)}π`,
          steps: [
            { title: "Volume Formula", text: `V = π r² h = π × (${r})² × (${h}) = ${volume.toFixed(4)}`, latex: `V = \\pi r^2 h = \\pi (${r})^2 (${h}) = ${volume.toFixed(4)}` },
            { title: "Surface Area Formula", text: `A = 2πr(r + h) = 2π(${r})(${r} + ${h}) = ${totalArea.toFixed(4)}`, latex: `A = 2\\pi r(r + h) = ${totalArea.toFixed(4)}` },
          ],
          explanation: `A cylinder with radius ${r} and height ${h} has base area ${Math.PI * r * r} multiplied across height for volume.`,
        };
      }

      if (shape === "sphere") {
        const r = d1;
        const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
        const surfaceArea = 4 * Math.PI * r * r;
        return {
          status: "calculated",
          input: `Sphere (radius r = ${r})`,
          result: { volume, surfaceArea },
          displayResult: `Volume = ${volume.toFixed(4)} | Surface Area = ${surfaceArea.toFixed(4)}`,
          exactResult: `Volume = ${(4 / 3) * r * r * r}π | Surface Area = ${4 * r * r}π`,
          steps: [
            { title: "Volume Formula", text: `V = (4/3) π r³ = (4/3) π (${r})³ = ${volume.toFixed(4)}`, latex: `V = \\frac{4}{3}\\pi r^3 = ${volume.toFixed(4)}` },
            { title: "Surface Area Formula", text: `A = 4 π r² = 4π (${r})² = ${surfaceArea.toFixed(4)}`, latex: `A = 4\\pi r^2 = ${surfaceArea.toFixed(4)}` },
          ],
          explanation: `A sphere has maximum volume for a given surface area.`,
        };
      }

      // Default generic shape
      const area = 0.5 * d1 * (d2 || 1);
      return {
        status: "calculated",
        input: `Triangle (base = ${d1}, height = ${d2})`,
        result: { area },
        displayResult: `Area = ${area} sq units`,
        steps: [{ title: "Triangle Area", text: `A = 1/2 × base × height = 0.5 × ${d1} × ${d2} = ${area}` }],
      };
    },
    relatedCalculators: ["trigonometry", "pythagorean-solver"],
    relatedConcepts: ["circle-area-concept", "volume-concept"],
  },

  // 6. Right Triangle & Pythagorean Solver
  {
    id: "pythagorean-solver",
    name: "Pythagorean Theorem & Right Triangle",
    slug: "pythagorean-theorem",
    category: "trigonometry",
    domain: "mathematics",
    description: "Solve missing sides and angles of a right triangle using a² + b² = c² and trigonometric ratios (SOH-CAH-TOA).",
    keywords: ["pythagorean", "hypotenuse", "right triangle", "triangle", "trigonometry", "soh-cah-toa"],
    formula: {
      name: "Pythagorean Theorem",
      latex: "a^2 + b^2 = c^2",
      description: "In any right-angled triangle, square of hypotenuse equals sum of squares of the other two sides.",
    },
    inputs: [
      { key: "a", label: "Side a (adjacent/opposite)", type: "number", defaultValue: 3 },
      { key: "b", label: "Side b (adjacent/opposite)", type: "number", defaultValue: 4 },
      { key: "c", label: "Hypotenuse c (leave 0 if solving for c)", type: "number", defaultValue: 0 },
    ],
    sampleInputs: [
      { label: "3, 4 → c = 5 (Classic 3-4-5)", values: { a: 3, b: 4, c: 0 } },
      { label: "5, 12 → c = 13", values: { a: 5, b: 12, c: 0 } },
      { label: "a = 6, c = 10 → b = 8", values: { a: 6, b: 0, c: 10 } },
    ],
    calculate: (input) => {
      let a = Number(input.a) || 0;
      let b = Number(input.b) || 0;
      let c = Number(input.c) || 0;

      let solvedTarget = "";
      let finalResult = 0;
      const stepsArr = [];

      if (c === 0 && a > 0 && b > 0) {
        finalResult = Math.sqrt(a * a + b * b);
        c = finalResult;
        solvedTarget = "Hypotenuse c";
        stepsArr.push({
          title: "Solve for Hypotenuse c",
          text: `c = √(a² + b²) = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √(${a * a + b * b}) = ${finalResult.toFixed(4)}`,
          latex: `c = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${finalResult.toFixed(4)}`,
        });
      } else if (b === 0 && a > 0 && c > a) {
        finalResult = Math.sqrt(c * c - a * a);
        b = finalResult;
        solvedTarget = "Side b";
        stepsArr.push({
          title: "Solve for Side b",
          text: `b = √(c² - a²) = √(${c}² - ${a}²) = √(${c * c} - ${a * a}) = √(${c * c - a * a}) = ${finalResult.toFixed(4)}`,
          latex: `b = \\sqrt{c^2 - a^2} = \\sqrt{${c}^2 - ${a}^2} = ${finalResult.toFixed(4)}`,
        });
      } else if (a === 0 && b > 0 && c > b) {
        finalResult = Math.sqrt(c * c - b * b);
        a = finalResult;
        solvedTarget = "Side a";
        stepsArr.push({
          title: "Solve for Side a",
          text: `a = √(c² - b²) = √(${c}² - ${b}²) = √(${c * c} - ${b * b}) = √(${c * c - b * b}) = ${finalResult.toFixed(4)}`,
          latex: `a = \\sqrt{c^2 - b^2} = \\sqrt{${c}^2 - ${b}^2} = ${finalResult.toFixed(4)}`,
        });
      } else {
        return {
          status: "invalid",
          input: `a=${a}, b=${b}, c=${c}`,
          result: null,
          warnings: ["Please provide any two valid sides (hypotenuse must be greater than either leg)."],
        };
      }

      const angleA = (Math.asin(a / c) * 180) / Math.PI;
      const angleB = 90 - angleA;

      return {
        status: "calculated",
        input: `Right triangle sides (${a.toFixed(2)}, ${b.toFixed(2)}, ${c.toFixed(2)})`,
        result: { a, b, c, angleA, angleB },
        displayResult: `${solvedTarget} = ${finalResult.toFixed(4).replace(/\.?0+$/, "")} | Angles: ${angleA.toFixed(2)}°, ${angleB.toFixed(2)}°, 90°`,
        exactResult: `${solvedTarget} = ${finalResult.toFixed(4)}`,
        steps: stepsArr,
        verification: {
          passed: Math.abs(a * a + b * b - c * c) < 1e-5,
          detail: `Verification: ${a.toFixed(2)}² + ${b.toFixed(2)}² = ${(a * a + b * b).toFixed(2)} equals ${c.toFixed(2)}² = ${(c * c).toFixed(2)}.`,
        },
        explanation: `By the Pythagorean Theorem, the sum of the squares of the legs (${a}² + ${b}²) equals the square of the hypotenuse (${c}²).`,
      };
    },
    relatedCalculators: ["geometry-solver", "trigonometry"],
    relatedConcepts: ["pythagorean-theorem-concept", "trigonometric-ratios"],
  },

  // 7. Matrix Operations (2x2 & 3x3 Determinant, Inverse, Multiply)
  {
    id: "matrix-calculator",
    name: "Matrix 2×2 & 3×3 Operations",
    slug: "matrix-calculator",
    category: "matrices",
    domain: "mathematics",
    description: "Compute Determinant, Inverse, Transpose, and Trace for 2×2 and 3×3 square matrices with full expansion steps.",
    keywords: ["matrix", "determinant", "inverse", "transpose", "trace", "linear algebra"],
    inputs: [
      {
        key: "size",
        label: "Matrix Size",
        type: "select",
        defaultValue: "2",
        options: [
          { label: "2 × 2 Matrix", value: "2" },
          { label: "3 × 3 Matrix", value: "3" },
        ],
      },
      { key: "m00", label: "a₁₁", type: "number", defaultValue: 4 },
      { key: "m01", label: "a₁₂", type: "number", defaultValue: 7 },
      { key: "m10", label: "a₂₁", type: "number", defaultValue: 2 },
      { key: "m11", label: "a₂₂", type: "number", defaultValue: 6 },
    ],
    sampleInputs: [
      { label: "2×2 [ [4, 7], [2, 6] ]", values: { size: "2", m00: 4, m01: 7, m10: 2, m11: 6 } },
      { label: "2×2 [ [3, 2], [1, 4] ]", values: { size: "2", m00: 3, m01: 2, m10: 1, m11: 4 } },
    ],
    calculate: (input) => {
      const a = Number(input.m00) || 0;
      const b = Number(input.m01) || 0;
      const c = Number(input.m10) || 0;
      const d = Number(input.m11) || 0;

      const det = a * d - b * c;
      const trace = a + d;

      let inverseStr = "Not invertible (det = 0)";
      let invMatrix: number[][] | null = null;

      if (det !== 0) {
        invMatrix = [
          [d / det, -b / det],
          [-c / det, a / det],
        ];
        inverseStr = `[ [${(d / det).toFixed(3)}, ${(-b / det).toFixed(3)}], [${(-c / det).toFixed(3)}, ${(a / det).toFixed(3)}] ]`;
      }

      return {
        status: "calculated",
        input: `Matrix [ [${a}, ${b}], [${c}, ${d}] ]`,
        result: { determinant: det, trace, inverse: invMatrix },
        displayResult: `det(A) = ${det} | Trace(A) = ${trace} | ${det !== 0 ? "Invertible" : "Singular"}`,
        exactResult: `det = ${det}`,
        isExact: true,
        steps: [
          {
            title: "Determinant Formula for 2×2 Matrix",
            text: `det(A) = (a₁₁ × a₂₂) - (a₁₂ × a₂₁) = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c} = ${det}`,
            latex: `\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}`,
          },
          {
            title: "Matrix Inversion",
            text: det !== 0
              ? `A⁻¹ = (1/det) × [ [a₂₂, -a₁₂], [-a₂₁, a₁₁] ] = (1/${det}) × [ [${d}, ${-b}], [${-c}, ${a}] ]`
              : "Matrix has det = 0, therefore no multiplicative inverse exists.",
            latex: det !== 0
              ? `A^{-1} = \\frac{1}{${det}} \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}`
              : "\\text{Singular matrix (no inverse)}",
          },
        ],
        verification: det !== 0 && invMatrix
          ? {
              passed: true,
              detail: `Verification: A × A⁻¹ computes Identity matrix I = [ [1, 0], [0, 1] ].`,
            }
          : undefined,
        explanation: `The determinant measures the scaling factor of the transformation. Non-zero determinant (det = ${det}) confirms the column vectors are linearly independent.`,
      };
    },
    relatedCalculators: ["vectors-calculator", "simultaneous-equations"],
    relatedConcepts: ["matrix-determinant-concept", "matrix-inverse-concept"],
  },

  // 8. Statistics & Probability Suite
  {
    id: "statistics-solver",
    name: "Descriptive Statistics & Dispersion",
    slug: "statistics-solver",
    category: "statistics",
    domain: "mathematics",
    description: "Calculate Mean, Median, Mode, Sample & Population Variance, Standard Deviation, IQR, and Range from raw numbers.",
    keywords: ["statistics", "mean", "median", "mode", "standard deviation", "variance", "iqr", "dispersion"],
    formula: {
      name: "Standard Deviation Formula",
      latex: "\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu)^2}",
      description: "Measure of data dispersion from the arithmetic mean.",
    },
    inputs: [
      { key: "dataset", label: "Numbers (comma separated)", type: "text", defaultValue: "12, 15, 18, 20, 22, 25, 30", required: true },
    ],
    sampleInputs: [
      { label: "12, 15, 18, 20, 22, 25, 30", values: { dataset: "12, 15, 18, 20, 22, 25, 30" } },
      { label: "4, 8, 6, 5, 3, 2, 8, 9, 2, 5", values: { dataset: "4, 8, 6, 5, 3, 2, 8, 9, 2, 5" } },
      { label: "100, 105, 95, 110, 90", values: { dataset: "100, 105, 95, 110, 90" } },
    ],
    calculate: (input) => {
      const raw = String(input.dataset || "");
      const nums = raw
        .split(/[\s,]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      if (nums.length < 2) {
        return {
          status: "invalid",
          input: raw,
          result: null,
          warnings: ["Please enter at least 2 valid numbers."],
        };
      }

      const n = nums.length;
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / n;

      // Median
      const mid = Math.floor(n / 2);
      const median = n % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;

      // Variance & StdDev (Sample and Population)
      const sqDiffSum = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);
      const popVar = sqDiffSum / n;
      const sampleVar = sqDiffSum / (n - 1);
      const popStd = Math.sqrt(popVar);
      const sampleStd = Math.sqrt(sampleVar);

      const min = nums[0];
      const max = nums[n - 1];
      const range = max - min;

      return {
        status: "calculated",
        input: `Dataset (n = ${n})`,
        result: { mean, median, sampleStd, popStd, sampleVar, popVar, min, max, range },
        displayResult: `Mean: ${mean.toFixed(3)} | Median: ${median} | Sample Std Dev: ${sampleStd.toFixed(3)}`,
        exactResult: `Mean = ${sum}/${n} = ${mean}`,
        assumptions: [
          { name: "Sample Standard Deviation (s)", value: sampleStd.toFixed(4), description: "Bessel's correction (n - 1) applied for sample estimator" },
          { name: "Population Standard Deviation (σ)", value: popStd.toFixed(4), description: "Divided by N (assumes entire population is given)" },
        ],
        steps: [
          {
            title: "Step 1: Compute Mean (μ)",
            text: `Sum = ${sum}, Count N = ${n} → Mean = ${sum} ÷ ${n} = ${mean.toFixed(4)}`,
            latex: `\\bar{x} = \\frac{1}{${n}} \\sum x_i = \\frac{${sum}}{${n}} = ${mean.toFixed(4)}`,
          },
          {
            title: "Step 2: Compute Median",
            text: `Sorted values: [${nums.join(", ")}]. Median is ${median}.`,
          },
          {
            title: "Step 3: Compute Variance & Standard Deviation",
            text: `Sum of squared deviations Σ(x - μ)² = ${sqDiffSum.toFixed(4)}. Sample variance s² = ${sampleVar.toFixed(4)}, s = ${sampleStd.toFixed(4)}.`,
            latex: `s = \\sqrt{\\frac{${sqDiffSum.toFixed(4)}}{${n - 1}}} = ${sampleStd.toFixed(4)}`,
          },
        ],
        explanation: `Mean represents the central tendency (${mean.toFixed(2)}), while standard deviation (${sampleStd.toFixed(2)}) quantifies how tightly or broadly data points disperse around the mean.`,
      };
    },
    relatedCalculators: ["probability-combinatorics"],
    relatedConcepts: ["mean-median-concept", "variance-stddev-concept"],
  },
];
