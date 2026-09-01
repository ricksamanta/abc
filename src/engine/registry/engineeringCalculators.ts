/**
 * CalcRick Engineering Domain Suite
 * Electrical, Electronics, Mechanical & Civil Engineering Toolkits
 */

import { CalculatorDefinition } from "@/types";

export const engineeringCalculators: CalculatorDefinition[] = [
  // 1. Voltage Divider & LED Series Resistor
  {
    id: "voltage-divider",
    name: "Voltage Divider & Potentiometer",
    slug: "voltage-divider",
    category: "engineering-electrical",
    domain: "engineering",
    description: "Calculate output voltage (V_out) and current for a resistive voltage divider circuit under no-load condition.",
    keywords: ["voltage divider", "potentiometer", "resistor divider", "electronics", "circuit"],
    formula: {
      name: "Voltage Divider Rule",
      latex: "V_{\\text{out}} = V_{\\text{in}} \\times \\frac{R_2}{R_1 + R_2}",
      variables: [
        { symbol: "V_in", meaning: "Input Voltage", unit: "V" },
        { symbol: "R1", meaning: "Top Resistor", unit: "Ω" },
        { symbol: "R2", meaning: "Bottom Resistor (connected to GND)", unit: "Ω" },
      ],
    },
    inputs: [
      { key: "vin", label: "Input Voltage (V_in in Volts)", type: "number", defaultValue: 5, required: true },
      { key: "r1", label: "Top Resistor R1 (in Ohms)", type: "number", defaultValue: 1000, required: true },
      { key: "r2", label: "Bottom Resistor R2 (in Ohms)", type: "number", defaultValue: 2000, required: true },
    ],
    sampleInputs: [
      { label: "5V to 3.3V Logic Level (R1=1.8k, R2=3.3k)", values: { vin: 5, r1: 1800, r2: 3300 } },
      { label: "12V to 5V (R1=14k, R2=10k)", values: { vin: 12, r1: 14000, r2: 10000 } },
    ],
    calculate: (input) => {
      const vin = Number(input.vin) || 0;
      const r1 = Number(input.r1) || 0;
      const r2 = Number(input.r2) || 0;

      if (r1 + r2 <= 0) {
        return { status: "invalid", input: "Voltage Divider", result: null, warnings: ["Sum of resistances must be strictly positive"] };
      }

      const vout = (vin * r2) / (r1 + r2);
      const current = vin / (r1 + r2); // Amperes
      const powerR1 = current * current * r1;
      const powerR2 = current * current * r2;

      return {
        status: "calculated",
        input: `Voltage Divider: Vin = ${vin}V, R1 = ${r1}Ω, R2 = ${r2}Ω`,
        result: { vout, current, powerR1, powerR2 },
        displayResult: `V_out = ${vout.toFixed(3)} V | Current: ${(current * 1000).toFixed(2)} mA`,
        steps: [
          {
            title: "Divider Ratio Calculation",
            text: `Ratio = R2 / (R1 + R2) = ${r2} / (${r1} + ${r2}) = ${(r2 / (r1 + r2)).toFixed(4)}`,
            latex: `\\frac{R_2}{R_1 + R_2} = \\frac{${r2}}{${r1} + ${r2}} = ${(r2 / (r1 + r2)).toFixed(4)}`,
          },
          {
            title: "Output Voltage",
            text: `V_out = ${vin} V × ${(r2 / (r1 + r2)).toFixed(4)} = ${vout.toFixed(3)} V`,
            latex: `V_{\\text{out}} = ${vin} \\times ${(r2 / (r1 + r2)).toFixed(4)} = ${vout.toFixed(3)}\\,\\text{V}`,
          },
        ],
        verification: {
          passed: Math.abs(vin - (vout + current * r1)) < 1e-4,
          detail: `Kirchhoff's Voltage Law: V_in (${vin} V) = V_R1 (${(current * r1).toFixed(3)} V) + V_out (${vout.toFixed(3)} V).`,
        },
        explanation: `Resistive voltage dividers scale down voltage proportionally without an active voltage regulator. Note: this assumes high-impedance load.`,
      };
    },
    relatedCalculators: ["ohms-law", "rc-circuit"],
    relatedConcepts: ["voltage-divider-concept"],
  },

  // 2. RC Time Constant & Filter Cutoff
  {
    id: "rc-circuit",
    name: "RC Time Constant & Cutoff Frequency",
    slug: "rc-circuit",
    category: "engineering-electrical",
    domain: "engineering",
    description: "Calculate RC time constant (τ = RC), charging time (5τ to 99.3%), and -3dB cutoff frequency (fc = 1 / (2πRC)).",
    keywords: ["rc circuit", "time constant", "cutoff frequency", "low pass filter", "capacitor", "electronics"],
    formula: {
      name: "RC Circuit Formulas",
      latex: "\\tau = R \\times C, \\quad f_c = \\frac{1}{2\\pi R C}",
      variables: [
        { symbol: "R", meaning: "Resistance", unit: "Ω (Ohms)" },
        { symbol: "C", meaning: "Capacitance", unit: "F (Farads)" },
        { symbol: "τ", meaning: "Time Constant (tau)", unit: "seconds (s)" },
      ],
    },
    inputs: [
      { key: "r", label: "Resistance R (Ohms)", type: "number", defaultValue: 10000, required: true },
      { key: "c_uF", label: "Capacitance C (in microfarads µF)", type: "number", defaultValue: 10, required: true },
    ],
    sampleInputs: [
      { label: "10kΩ & 10µF (τ = 0.1s)", values: { r: 10000, c_uF: 10 } },
      { label: "1kΩ & 100nF (fc ≈ 1.59 kHz)", values: { r: 1000, c_uF: 0.1 } },
    ],
    calculate: (input) => {
      const r = Number(input.r) || 0;
      const c_uF = Number(input.c_uF) || 0;
      const c = c_uF * 1e-6; // convert to Farads

      if (r <= 0 || c <= 0) {
        return { status: "invalid", input: "RC Circuit", result: null, warnings: ["Resistance and Capacitance must be positive"] };
      }

      const tau = r * c; // seconds
      const fiveTau = 5 * tau;
      const fc = 1 / (2 * Math.PI * r * c); // Hertz

      return {
        status: "calculated",
        input: `RC Circuit: R = ${r} Ω, C = ${c_uF} µF`,
        result: { tau, fiveTau, fc },
        displayResult: `τ = ${(tau * 1000).toFixed(2)} ms | 5τ (Full Charge) = ${(fiveTau * 1000).toFixed(2)} ms | Cutoff fc = ${fc.toFixed(2)} Hz`,
        steps: [
          {
            title: "Time Constant (τ)",
            text: `τ = R × C = (${r} Ω) × (${c_uF} × 10⁻⁶ F) = ${tau.toFixed(4)} seconds (${(tau * 1000).toFixed(2)} ms)`,
            latex: `\\tau = RC = (${r})(${c}) = ${tau.toFixed(4)}\\,\\text{s}`,
          },
          {
            title: "Cutoff Frequency (-3dB)",
            text: `f_c = 1 / (2π × R × C) = 1 / (2π × ${tau.toFixed(4)}) = ${fc.toFixed(2)} Hz`,
            latex: `f_c = \\frac{1}{2\\pi RC} = ${fc.toFixed(2)}\\,\\text{Hz}`,
          },
        ],
        explanation: `In an RC series circuit, the capacitor charges to 63.2% of supply voltage after 1 time constant (τ), and essentially fully charged (>99.3%) after 5τ.`,
      };
    },
    relatedCalculators: ["ohms-law", "voltage-divider"],
    relatedConcepts: ["rc-filter-concept"],
  },

  // 3. Mechanical Stress, Strain & Young's Modulus
  {
    id: "stress-strain",
    name: "Mechanical Stress, Strain & Young's Modulus",
    slug: "stress-strain",
    category: "engineering-mechanical",
    domain: "engineering",
    description: "Calculate Normal Stress (σ = F/A), Engineering Strain (ε = ΔL/L₀), and Young's Modulus of Elasticity (E = σ/ε).",
    keywords: ["stress", "strain", "youngs modulus", "elasticity", "materials", "mechanical", "pascal"],
    formula: {
      name: "Hooke's Law for Elastic Materials",
      latex: "\\sigma = \\frac{F}{A}, \\quad \\epsilon = \\frac{\\Delta L}{L_0}, \\quad E = \\frac{\\sigma}{\\epsilon}",
      variables: [
        { symbol: "σ", meaning: "Stress", unit: "Pa or MPa" },
        { symbol: "ε", meaning: "Strain", unit: "dimensionless" },
        { symbol: "E", meaning: "Young's Modulus", unit: "GPa" },
      ],
    },
    inputs: [
      { key: "force", label: "Applied Force (F in Newtons)", type: "number", defaultValue: 50000, required: true },
      { key: "area_mm2", label: "Cross-sectional Area (in mm²)", type: "number", defaultValue: 200, required: true },
      { key: "orig_len", label: "Original Length L₀ (in mm)", type: "number", defaultValue: 1000, required: true },
      { key: "delta_len", label: "Elongation ΔL (in mm)", type: "number", defaultValue: 1.25, required: true },
    ],
    sampleInputs: [
      { label: "Steel rod: F=50kN, A=200mm², L₀=1000mm, ΔL=1.25mm", values: { force: 50000, area_mm2: 200, orig_len: 1000, delta_len: 1.25 } },
    ],
    calculate: (input) => {
      const f = Number(input.force) || 0;
      const a_mm2 = Number(input.area_mm2) || 1;
      const l0 = Number(input.orig_len) || 1;
      const dl = Number(input.delta_len) || 0;

      const a_m2 = a_mm2 * 1e-6;
      const stress_Pa = f / a_m2;
      const stress_MPa = stress_Pa / 1e6;

      const strain = dl / l0;
      const youngs_GPa = (stress_Pa / (strain || 1e-9)) / 1e9;

      return {
        status: "calculated",
        input: `Stress & Strain: F = ${f}N, Area = ${a_mm2} mm²`,
        result: { stress_MPa, strain, youngs_GPa },
        displayResult: `Stress (σ) = ${stress_MPa.toFixed(2)} MPa | Strain (ε) = ${(strain * 100).toFixed(3)}% | Young's Modulus (E) = ${youngs_GPa.toFixed(2)} GPa`,
        steps: [
          {
            title: "Normal Stress (σ)",
            text: `σ = Force ÷ Area = ${f} N ÷ (${a_mm2} × 10⁻⁶ m²) = ${stress_MPa.toFixed(2)} MPa`,
            latex: `\\sigma = \\frac{${f}\\,\\text{N}}{${a_m2}\\,\\text{m}^2} = ${stress_MPa.toFixed(2)}\\,\\text{MPa}`,
          },
          {
            title: "Engineering Strain (ε)",
            text: `ε = ΔL ÷ L₀ = ${dl} mm ÷ ${l0} mm = ${strain.toFixed(5)} (${(strain * 100).toFixed(3)}%)`,
            latex: `\\epsilon = \\frac{${dl}}{${l0}} = ${strain.toFixed(5)}`,
          },
          {
            title: "Modulus of Elasticity (E)",
            text: `E = σ ÷ ε = ${stress_MPa.toFixed(2)} MPa ÷ ${strain.toFixed(5)} = ${youngs_GPa.toFixed(2)} GPa`,
            latex: `E = \\frac{\\sigma}{\\epsilon} = ${youngs_GPa.toFixed(2)}\\,\\text{GPa}`,
          },
        ],
        explanation: `Young's Modulus represents the stiffness of a solid material in the linear elastic deformation regime where Hooke's Law applies.`,
      };
    },
    relatedCalculators: ["force-newton"],
    relatedConcepts: ["stress-strain-concept"],
  },
];
