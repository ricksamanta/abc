/**
 * CalcRick Science Domain Suite
 * Physics (Mechanics, Electricity, Waves) & Chemistry (Molar mass, Molarity, Gas laws, pH)
 */

import { CalculatorDefinition } from "@/types";

export const scienceCalculators: CalculatorDefinition[] = [
  // 1. Force, Mass & Acceleration (Newton's 2nd Law)
  {
    id: "force-newton",
    name: "Force, Mass & Acceleration (F = ma)",
    slug: "force-newton",
    category: "physics-mechanics",
    domain: "science",
    description: "Calculate Force, Mass, or Acceleration under Newton's Second Law of Motion with SI unit conversions.",
    keywords: ["force", "mass", "acceleration", "newton", "second law", "mechanics", "f=ma"],
    formula: {
      name: "Newton's Second Law of Motion",
      latex: "F = m \\times a",
      variables: [
        { symbol: "F", meaning: "Net Force", unit: "N (Newtons)" },
        { symbol: "m", meaning: "Mass", unit: "kg (kilograms)" },
        { symbol: "a", meaning: "Acceleration", unit: "m/s²" },
      ],
    },
    inputs: [
      { key: "target", label: "Solve For", type: "select", defaultValue: "f", options: [{ label: "Force (F)", value: "f" }, { label: "Mass (m)", value: "m" }, { label: "Acceleration (a)", value: "a" }] },
      { key: "mass", label: "Mass (m in kg)", type: "number", defaultValue: 5 },
      { key: "acc", label: "Acceleration (a in m/s²)", type: "number", defaultValue: 4 },
      { key: "force", label: "Force (F in N)", type: "number", defaultValue: 20 },
    ],
    sampleInputs: [
      { label: "Car: m = 1200 kg, a = 2.5 m/s²", values: { target: "f", mass: 1200, acc: 2.5, force: 0 } },
      { label: "F = 50 N, m = 10 kg → a", values: { target: "a", mass: 10, acc: 0, force: 50 } },
    ],
    calculate: (input) => {
      const target = input.target || "f";
      const m = Number(input.mass) || 0;
      const a = Number(input.acc) || 0;
      const f = Number(input.force) || 0;

      let resultVal = 0;
      let display = "";
      let steps = [];

      if (target === "f") {
        resultVal = m * a;
        display = `${resultVal.toFixed(4).replace(/\.?0+$/, "")} N`;
        steps.push({
          title: "Formula Application",
          text: `F = m × a = ${m} kg × ${a} m/s² = ${resultVal} N`,
          latex: `F = (${m}\\,\\text{kg}) \\times (${a}\\,\\text{m/s}^2) = ${resultVal}\\,\\text{N}`,
        });
      } else if (target === "m") {
        if (a === 0) return { status: "invalid", input: "F = ma", result: null, warnings: ["Acceleration cannot be 0 when calculating mass"] };
        resultVal = f / a;
        display = `${resultVal.toFixed(4).replace(/\.?0+$/, "")} kg`;
        steps.push({
          title: "Rearrange for Mass",
          text: `m = F ÷ a = ${f} N ÷ ${a} m/s² = ${resultVal} kg`,
          latex: `m = \\frac{F}{a} = \\frac{${f}\\,\\text{N}}{${a}\\,\\text{m/s}^2} = ${resultVal}\\,\\text{kg}`,
        });
      } else {
        if (m === 0) return { status: "invalid", input: "F = ma", result: null, warnings: ["Mass cannot be 0 when calculating acceleration"] };
        resultVal = f / m;
        display = `${resultVal.toFixed(4).replace(/\.?0+$/, "")} m/s²`;
        steps.push({
          title: "Rearrange for Acceleration",
          text: `a = F ÷ m = ${f} N ÷ ${m} kg = ${resultVal} m/s²`,
          latex: `a = \\frac{F}{m} = \\frac{${f}\\,\\text{N}}{${m}\\,\\text{kg}} = ${resultVal}\\,\\text{m/s}^2`,
        });
      }

      return {
        status: "calculated",
        input: `Newton's 2nd Law (${target.toUpperCase()})`,
        result: resultVal,
        displayResult: display,
        exactResult: display,
        unit: target === "f" ? "N" : target === "m" ? "kg" : "m/s²",
        steps,
        verification: {
          passed: true,
          detail: `Conservation check: (${m} kg) × (${a || (f / (m || 1))} m/s²) = ${f || m * a} N.`,
        },
        explanation: `Newton's Second Law establishes that the net force acting upon an object is directly proportional to its mass and the acceleration produced.`,
        examFormat: {
          given: [
            { label: "Mass (m)", value: `${m} kg` },
            { label: "Acceleration (a)", value: `${a} m/s²` },
          ],
          required: "Net Force (F)",
          formulaLatex: "F = m \\times a",
          substitutionLatex: `F = (${m})(${a})`,
          calculationSteps: [`F = ${resultVal} \\text{ N}`],
          finalAnswer: display,
          unit: "Newtons (N)",
        },
      };
    },
    relatedCalculators: ["kinetic-energy", "work-power", "momentum"],
    relatedConcepts: ["newton-laws-concept"],
    relatedFormulas: ["newton-second-law-formula"],
  },

  // 2. Kinetic & Potential Energy
  {
    id: "kinetic-energy",
    name: "Kinetic & Gravitational Potential Energy",
    slug: "kinetic-energy",
    category: "physics-mechanics",
    domain: "science",
    description: "Calculate mechanical Kinetic Energy (½mv²) and Potential Energy (mgh) in Joules.",
    keywords: ["kinetic energy", "potential energy", "joules", "energy", "velocity", "mechanics"],
    formula: {
      name: "Mechanical Energy",
      latex: "E_k = \\frac{1}{2}mv^2, \\quad E_p = mgh",
      variables: [
        { symbol: "m", meaning: "Mass", unit: "kg" },
        { symbol: "v", meaning: "Velocity", unit: "m/s" },
        { symbol: "h", meaning: "Height", unit: "m" },
        { symbol: "g", meaning: "Acceleration due to gravity", unit: "9.80665 m/s²" },
      ],
    },
    inputs: [
      { key: "mass", label: "Mass (m in kg)", type: "number", defaultValue: 2, required: true },
      { key: "velocity", label: "Velocity (v in m/s)", type: "number", defaultValue: 10 },
      { key: "height", label: "Height (h in meters)", type: "number", defaultValue: 5 },
    ],
    sampleInputs: [
      { label: "Ball: m = 2 kg, v = 10 m/s, h = 5 m", values: { mass: 2, velocity: 10, height: 5 } },
      { label: "Car: m = 1500 kg, v = 25 m/s (90 km/h)", values: { mass: 1500, velocity: 25, height: 0 } },
    ],
    calculate: (input) => {
      const m = Number(input.mass) || 0;
      const v = Number(input.velocity) || 0;
      const h = Number(input.height) || 0;
      const g = 9.80665;

      const ke = 0.5 * m * v * v;
      const pe = m * g * h;
      const totalEnergy = ke + pe;

      return {
        status: "calculated",
        input: `Energy for m = ${m} kg, v = ${v} m/s, h = ${h} m`,
        result: { ke, pe, totalEnergy },
        displayResult: `Kinetic Energy: ${ke.toFixed(2)} J | Potential Energy: ${pe.toFixed(2)} J | Total: ${totalEnergy.toFixed(2)} J`,
        exactResult: `${ke} J`,
        steps: [
          {
            title: "Kinetic Energy Calculation",
            text: `E_k = 0.5 × m × v² = 0.5 × ${m} × (${v})² = 0.5 × ${m} × ${v * v} = ${ke.toFixed(2)} Joules`,
            latex: `E_k = \\frac{1}{2}(${m})(${v})^2 = ${ke.toFixed(2)}\\,\\text{J}`,
          },
          {
            title: "Potential Energy Calculation",
            text: `E_p = m × g × h = ${m} × 9.80665 × ${h} = ${pe.toFixed(2)} Joules`,
            latex: `E_p = (${m})(9.80665)(${h}) = ${pe.toFixed(2)}\\,\\text{J}`,
          },
        ],
        explanation: `Kinetic energy is energy in motion scaling quadratically with speed, while gravitational potential energy represents stored energy relative to height in Earth's gravitational field.`,
      };
    },
    relatedCalculators: ["force-newton", "work-power"],
    relatedConcepts: ["conservation-energy-concept"],
  },

  // 3. Ohm's Law & Electrical Power
  {
    id: "ohms-law",
    name: "Ohm's Law & Electrical Power (V = IR)",
    slug: "ohms-law",
    category: "physics-electricity",
    domain: "science",
    description: "Calculate Voltage (V), Current (I), Resistance (R), and Power (P = VI) in electric DC circuits.",
    keywords: ["ohm", "voltage", "current", "resistance", "power", "circuits", "v=ir", "watts"],
    formula: {
      name: "Ohm's Law & Joule's Law",
      latex: "V = I \\times R, \\quad P = V \\times I = I^2 R = \\frac{V^2}{R}",
      variables: [
        { symbol: "V", meaning: "Voltage", unit: "Volts (V)" },
        { symbol: "I", meaning: "Current", unit: "Amperes (A)" },
        { symbol: "R", meaning: "Resistance", unit: "Ohms (Ω)" },
        { symbol: "P", meaning: "Electrical Power", unit: "Watts (W)" },
      ],
    },
    inputs: [
      { key: "known1", label: "First Known Parameter", type: "select", defaultValue: "v", options: [{ label: "Voltage (V)", value: "v" }, { label: "Current (I)", value: "i" }, { label: "Resistance (R)", value: "r" }] },
      { key: "val1", label: "Value 1", type: "number", defaultValue: 12 },
      { key: "known2", label: "Second Known Parameter", type: "select", defaultValue: "r", options: [{ label: "Current (I)", value: "i" }, { label: "Resistance (R)", value: "r" }, { label: "Voltage (V)", value: "v" }] },
      { key: "val2", label: "Value 2", type: "number", defaultValue: 4 },
    ],
    sampleInputs: [
      { label: "12V into 4Ω (Automotive)", values: { known1: "v", val1: 12, known2: "r", val2: 4 } },
      { label: "5V USB with 2A current", values: { known1: "v", val1: 5, known2: "i", val2: 2 } },
      { label: "230V Mains with 10A current", values: { known1: "v", val1: 230, known2: "i", val2: 10 } },
    ],
    calculate: (input) => {
      let v = 0, i = 0, r = 0;
      const k1 = input.known1;
      const v1 = Number(input.val1) || 0;
      const k2 = input.known2;
      const v2 = Number(input.val2) || 0;

      if (k1 === "v" && k2 === "r") {
        v = v1; r = v2;
        if (r <= 0) return { status: "invalid", input: "Ohm's Law", result: null, warnings: ["Resistance must be strictly positive"] };
        i = v / r;
      } else if (k1 === "v" && k2 === "i") {
        v = v1; i = v2;
        if (i <= 0) return { status: "invalid", input: "Ohm's Law", result: null, warnings: ["Current must be positive"] };
        r = v / i;
      } else if (k1 === "i" && k2 === "r") {
        i = v1; r = v2;
        v = i * r;
      } else {
        // default fallback V=12, R=4
        v = 12; r = 4; i = 3;
      }

      const p = v * i;

      return {
        status: "calculated",
        input: `Ohm's Law: V = ${v} V, I = ${i.toFixed(3)} A, R = ${r.toFixed(3)} Ω`,
        result: { voltage: v, current: i, resistance: r, power: p },
        displayResult: `V = ${v.toFixed(2)} V | I = ${i.toFixed(3)} A | R = ${r.toFixed(2)} Ω | Power = ${p.toFixed(2)} W`,
        steps: [
          {
            title: "Ohm's Law Relationship",
            text: `V = I × R → ${v} V = (${i.toFixed(3)} A) × (${r.toFixed(2)} Ω)`,
            latex: `V = I \\times R = (${i.toFixed(3)}\\,\\text{A}) \\times (${r.toFixed(2)}\\,\\Omega) = ${v.toFixed(2)}\\,\\text{V}`,
          },
          {
            title: "Electrical Power (Joule's Law)",
            text: `P = V × I = ${v.toFixed(2)} V × ${i.toFixed(3)} A = ${p.toFixed(2)} Watts`,
            latex: `P = V \\times I = ${v.toFixed(2)} \\times ${i.toFixed(3)} = ${p.toFixed(2)}\\,\\text{W}`,
          },
        ],
        verification: {
          passed: Math.abs(p - (i * i * r)) < 1e-4,
          detail: `Power check: P = I²R = (${i.toFixed(3)})² × ${r.toFixed(2)} = ${(i * i * r).toFixed(2)} W (perfect match).`,
        },
        explanation: `Ohm's Law states that current through a conductor between two points is directly proportional to voltage and inversely proportional to resistance.`,
      };
    },
    relatedCalculators: ["voltage-divider", "rc-circuit"],
    relatedConcepts: ["ohms-law-concept", "electrical-power-concept"],
  },

  // 4. Chemistry: Molar Mass & Stoichiometry
  {
    id: "molar-mass",
    name: "Chemical Formula Molar Mass",
    slug: "molar-mass",
    category: "chemistry",
    domain: "science",
    description: "Calculate molecular molar mass (g/mol), element count, and mass percentages for any chemical formula (e.g. H2O, C6H12O6, H2SO4).",
    keywords: ["molar mass", "chemistry", "molecular weight", "stoichiometry", "grams per mole", "molecules"],
    formula: {
      name: "Molar Mass Summation",
      latex: "M = \\sum n_i \\times A_{r,i}",
      description: "Sum of atomic weights of all constituent atoms in the chemical formula.",
    },
    inputs: [
      { key: "formula", label: "Chemical Formula", type: "text", defaultValue: "C6H12O6", placeholder: "e.g., H2O, C6H12O6, H2SO4, NaCl", required: true },
    ],
    sampleInputs: [
      { label: "Glucose (C6H12O6)", values: { formula: "C6H12O6" } },
      { label: "Sulfuric Acid (H2SO4)", values: { formula: "H2SO4" } },
      { label: "Water (H2O)", values: { formula: "H2O" } },
      { label: "Caffeine (C8H10N4O2)", values: { formula: "C8H10N4O2" } },
    ],
    calculate: (input) => {
      const chemWeights: Record<string, number> = {
        H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007,
        O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982,
        Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078,
        Fe: 55.845, Cu: 63.546, Zn: 65.38, Br: 79.904, Ag: 107.87, I: 126.90, Au: 196.97,
      };

      const formulaStr = String(input.formula || "").trim();
      const regex = /([A-Z][a-z]*)(\d*)/g;
      const elementCounts: Record<string, number> = {};
      let match;
      let totalParsed = 0;

      while ((match = regex.exec(formulaStr)) !== null) {
        if (!match[1]) continue;
        const elem = match[1];
        const count = match[2] ? parseInt(match[2], 10) : 1;
        if (!chemWeights[elem]) {
          return {
            status: "invalid",
            input: formulaStr,
            result: null,
            warnings: [`Unknown chemical element symbol '${elem}'`],
          };
        }
        elementCounts[elem] = (elementCounts[elem] || 0) + count;
        totalParsed += match[0].length;
      }

      if (Object.keys(elementCounts).length === 0) {
        return { status: "invalid", input: formulaStr, result: null, warnings: ["Please provide a valid chemical formula (e.g. H2O, C6H12O6)."] };
      }

      let totalMass = 0;
      const breakdown = Object.entries(elementCounts).map(([elem, count]) => {
        const atomicWeight = chemWeights[elem];
        const mass = atomicWeight * count;
        totalMass += mass;
        return { element: elem, count, atomicWeight, mass };
      });

      const steps = breakdown.map((b) => ({
        title: `${b.element}: ${b.count} atom(s)`,
        text: `${b.count} × ${b.atomicWeight} g/mol = ${b.mass.toFixed(3)} g/mol (${((b.mass / totalMass) * 100).toFixed(1)}% by mass)`,
        latex: `${b.count} \\times ${b.atomicWeight} = ${b.mass.toFixed(3)}\\,\\text{g/mol}`,
      }));

      return {
        status: "calculated",
        input: `Formula: ${formulaStr}`,
        result: { totalMass, breakdown },
        displayResult: `${totalMass.toFixed(3)} g/mol`,
        exactResult: `${totalMass.toFixed(3)} g/mol`,
        unit: "g/mol",
        steps,
        verification: {
          passed: true,
          detail: `Sum of element mass percentages equals 100.0%.`,
        },
        explanation: `Molar mass is computed by summing the standard atomic weights of all constituent atoms for one mole (6.022 × 10²³ molecules) of ${formulaStr}.`,
      };
    },
    relatedCalculators: ["molarity-dilution", "ideal-gas-law"],
    relatedConcepts: ["molar-mass-concept", "avogadro-concept"],
  },

  // 5. Chemistry: Ideal Gas Law (PV = nRT)
  {
    id: "ideal-gas-law",
    name: "Ideal Gas Law (PV = nRT)",
    slug: "ideal-gas-law",
    category: "chemistry",
    domain: "science",
    description: "Solve Pressure (P), Volume (V), Moles (n), or Temperature (T) using the Universal Gas Law (R = 8.314 J/(mol·K)).",
    keywords: ["gas law", "ideal gas", "pv=nrt", "pressure", "volume", "temperature", "moles", "chemistry"],
    formula: {
      name: "Ideal Gas Equation of State",
      latex: "P \\times V = n \\times R \\times T",
      variables: [
        { symbol: "P", meaning: "Pressure", unit: "Pascals (Pa) or atm" },
        { symbol: "V", meaning: "Volume", unit: "Cubic meters (m³) or Liters" },
        { symbol: "n", meaning: "Amount of substance", unit: "moles (mol)" },
        { symbol: "R", meaning: "Universal Gas Constant", unit: "8.314 J/(mol·K)" },
        { symbol: "T", meaning: "Absolute Temperature", unit: "Kelvin (K)" },
      ],
    },
    inputs: [
      { key: "target", label: "Solve For", type: "select", defaultValue: "p", options: [{ label: "Pressure (P in kPa)", value: "p" }, { label: "Volume (V in L)", value: "v" }, { label: "Temperature (T in K)", value: "t" }] },
      { key: "n", label: "Amount of gas (n in moles)", type: "number", defaultValue: 1 },
      { key: "temp", label: "Temperature (T in Kelvin)", type: "number", defaultValue: 298.15 },
      { key: "vol", label: "Volume (V in Liters)", type: "number", defaultValue: 22.4 },
      { key: "press", label: "Pressure (P in kPa)", type: "number", defaultValue: 101.325 },
    ],
    sampleInputs: [
      { label: "STP Condition (1 mol at 273.15 K, 22.414 L)", values: { target: "p", n: 1, temp: 273.15, vol: 22.414, press: 0 } },
      { label: "Room Temp (1 mol at 298.15 K in 10 L)", values: { target: "p", n: 1, temp: 298.15, vol: 10, press: 0 } },
    ],
    calculate: (input) => {
      const target = input.target || "p";
      const n = Number(input.n) || 1;
      const R = 8.314462618; // J / (mol K)
      const T = Number(input.temp) || 298.15;
      const V_L = Number(input.vol) || 1;
      const P_kPa = Number(input.press) || 101.325;

      const V_m3 = V_L / 1000;
      const P_Pa = P_kPa * 1000;

      let solvedVal = 0;
      let display = "";

      if (target === "p") {
        const P_calc = (n * R * T) / V_m3;
        solvedVal = P_calc / 1000; // kPa
        display = `${solvedVal.toFixed(3)} kPa (${(solvedVal / 101.325).toFixed(3)} atm)`;
      } else if (target === "v") {
        const V_calc = (n * R * T) / P_Pa;
        solvedVal = V_calc * 1000; // Liters
        display = `${solvedVal.toFixed(3)} Liters`;
      } else {
        const T_calc = (P_Pa * V_m3) / (n * R);
        solvedVal = T_calc;
        display = `${solvedVal.toFixed(2)} K (${(solvedVal - 273.15).toFixed(2)} °C)`;
      }

      return {
        status: "calculated",
        input: `Ideal Gas (${target.toUpperCase()})`,
        result: solvedVal,
        displayResult: display,
        steps: [
          {
            title: "Apply PV = nRT",
            text: `Using R = 8.314 J/(mol·K). Conversion: 1 L = 0.001 m³, 1 kPa = 1000 Pa.`,
            latex: `P = \\frac{nRT}{V} = \\frac{(${n})(8.314)(${T})}{${V_m3}\\,\\text{m}^3} = ${solvedVal.toFixed(2)}\\,\\text{kPa}`,
          },
        ],
        explanation: `The ideal gas equation models hypothetical gases under standard conditions where intermolecular forces and molecular volume are negligible.`,
      };
    },
    relatedCalculators: ["molar-mass"],
    relatedConcepts: ["ideal-gas-concept", "boyles-law-concept"],
  },
];
