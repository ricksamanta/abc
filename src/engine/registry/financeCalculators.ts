/**
 * CalcRick Finance Domain Suite
 * Real Interest, EMI, SIP, Future Value & Business Margin Engines
 */

import { CalculatorDefinition } from "@/types";

export const financeCalculators: CalculatorDefinition[] = [
  // 1. Loan EMI & Mortgage Calculator
  {
    id: "loan-emi",
    name: "Loan EMI & Mortgage Amortization",
    slug: "loan-emi",
    category: "finance-loans",
    domain: "finance",
    description: "Calculate Equated Monthly Installment (EMI), total interest payable, and total repayment amount for home, auto, or personal loans.",
    keywords: ["emi", "loan", "mortgage", "interest", "monthly installment", "amortization", "finance"],
    formula: {
      name: "Standard EMI Formula",
      latex: "E = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1}",
      variables: [
        { symbol: "P", meaning: "Principal loan amount" },
        { symbol: "r", meaning: "Monthly interest rate (Annual % ÷ 12 ÷ 100)" },
        { symbol: "n", meaning: "Tenure in total months" },
      ],
    },
    inputs: [
      { key: "principal", label: "Loan Amount (Principal)", type: "number", defaultValue: 500000, required: true },
      { key: "rate", label: "Annual Interest Rate (%)", type: "number", defaultValue: 8.5, required: true },
      { key: "years", label: "Loan Tenure (in Years)", type: "number", defaultValue: 5, required: true },
    ],
    sampleInputs: [
      { label: "$500,000 Home Loan at 8.5% for 5 Years", values: { principal: 500000, rate: 8.5, years: 5 } },
      { label: "$25,000 Auto Loan at 6.0% for 3 Years", values: { principal: 25000, rate: 6.0, years: 3 } },
      { label: "$10,000 Personal Loan at 12.0% for 2 Years", values: { principal: 10000, rate: 12.0, years: 2 } },
    ],
    calculate: (input) => {
      const p = Number(input.principal) || 0;
      const annualRate = Number(input.rate) || 0;
      const years = Number(input.years) || 1;

      if (p <= 0 || years <= 0) {
        return { status: "invalid", input: "Loan EMI", result: null, warnings: ["Principal and tenure must be positive numbers"] };
      }

      const n = years * 12;
      const r = annualRate / 12 / 100;

      let emi = 0;
      if (r === 0) {
        emi = p / n;
      } else {
        const factor = Math.pow(1 + r, n);
        emi = (p * r * factor) / (factor - 1);
      }

      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;

      return {
        status: "calculated",
        input: `Loan: ${p.toLocaleString()} at ${annualRate}% for ${years} years`,
        result: { emi, totalPayment, totalInterest, months: n },
        displayResult: `Monthly EMI: $${emi.toFixed(2)} | Total Interest: $${totalInterest.toFixed(2)} | Total Paid: $${totalPayment.toFixed(2)}`,
        assumptions: [
          { name: "Compounding Frequency", value: "Monthly", description: "Interest is compounded on a monthly reducing balance." },
          { name: "Legal Note", value: "Estimate only", description: "This is a calculation based on the assumptions provided and not a guarantee." },
        ],
        steps: [
          {
            title: "Monthly Rate & Tenure",
            text: `Monthly interest rate r = ${annualRate}% ÷ 1200 = ${r.toFixed(6)}. Total tenure n = ${years} × 12 = ${n} months.`,
            latex: `r = \\frac{${annualRate}}{1200} = ${r.toFixed(6)}, \\quad n = ${years} \\times 12 = ${n}`,
          },
          {
            title: "EMI Calculation",
            text: `EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1) = $${emi.toFixed(2)} / month`,
            latex: `E = ${p} \\times ${r.toFixed(5)} \\times \\frac{(1 + ${r.toFixed(5)})^{${n}}}{(1 + ${r.toFixed(5)})^{${n}} - 1} = \\$${emi.toFixed(2)}`,
          },
          {
            title: "Total Interest & Cost",
            text: `Total Paid = ${n} × $${emi.toFixed(2)} = $${totalPayment.toFixed(2)}. Total Interest = $${totalInterest.toFixed(2)}.`,
          },
        ],
        verification: {
          passed: Math.abs(p + totalInterest - totalPayment) < 0.01,
          detail: `Balance check: Principal ($${p.toFixed(2)}) + Interest ($${totalInterest.toFixed(2)}) = Total Payment ($${totalPayment.toFixed(2)}).`,
        },
        explanation: `Equated Monthly Installment (EMI) provides a constant monthly payment comprising both principal repayment and reducing-balance interest over ${years} years.`,
      };
    },
    relatedCalculators: ["compound-interest", "sip-investment"],
    relatedConcepts: ["amortization-concept", "compound-interest-concept"],
  },

  // 2. Compound Interest & Future Value
  {
    id: "compound-interest",
    name: "Compound Interest & Growth",
    slug: "compound-interest",
    category: "finance-interest",
    domain: "finance",
    description: "Calculate Future Value, total compound interest earned, and effective annual rate with custom compounding frequencies.",
    keywords: ["compound interest", "future value", "interest", "savings", "cagr", "investment"],
    formula: {
      name: "Compound Interest Formula",
      latex: "A = P \\left(1 + \\frac{r}{n}\\right)^{nt}",
      variables: [
        { symbol: "P", meaning: "Initial Principal" },
        { symbol: "r", meaning: "Annual interest rate (decimal)" },
        { symbol: "n", meaning: "Compounding frequency per year" },
        { symbol: "t", meaning: "Time in years" },
      ],
    },
    inputs: [
      { key: "principal", label: "Initial Principal (P)", type: "number", defaultValue: 10000, required: true },
      { key: "rate", label: "Annual Interest Rate (% p.a.)", type: "number", defaultValue: 7.0, required: true },
      { key: "time", label: "Time Period (Years)", type: "number", defaultValue: 10, required: true },
      {
        key: "freq",
        label: "Compounding Frequency",
        type: "select",
        defaultValue: "12",
        options: [
          { label: "Annually (1x / yr)", value: "1" },
          { label: "Semi-Annually (2x / yr)", value: "2" },
          { label: "Quarterly (4x / yr)", value: "4" },
          { label: "Monthly (12x / yr)", value: "12" },
          { label: "Daily (365x / yr)", value: "365" },
        ],
      },
    ],
    sampleInputs: [
      { label: "$10,000 at 7% for 10 years (Monthly)", values: { principal: 10000, rate: 7, time: 10, freq: "12" } },
      { label: "$50,000 at 10% for 20 years (Annual)", values: { principal: 50000, rate: 10, time: 20, freq: "1" } },
    ],
    calculate: (input) => {
      const p = Number(input.principal) || 0;
      const r = (Number(input.rate) || 0) / 100;
      const t = Number(input.time) || 1;
      const n = Number(input.freq) || 12;

      const futureValue = p * Math.pow(1 + r / n, n * t);
      const totalInterest = futureValue - p;
      const apy = (Math.pow(1 + r / n, n) - 1) * 100;

      return {
        status: "calculated",
        input: `P = $${p}, r = ${(r * 100).toFixed(2)}%, t = ${t} yrs, n = ${n}/yr`,
        result: { futureValue, totalInterest, apy },
        displayResult: `Future Value: $${futureValue.toFixed(2)} | Total Interest Earned: $${totalInterest.toFixed(2)} | APY: ${apy.toFixed(2)}%`,
        steps: [
          {
            title: "Formula Application",
            text: `A = P × (1 + r/n)^(n × t) = ${p} × (1 + ${(r / n).toFixed(5)})^(${n * t}) = $${futureValue.toFixed(2)}`,
            latex: `A = ${p} \\left(1 + \\frac{${(r * 100).toFixed(2)}}{${n} \\times 100}\\right)^{${n} \\times ${t}} = \\$${futureValue.toFixed(2)}`,
          },
          {
            title: "Interest & Effective Yield",
            text: `Interest Earned = $${futureValue.toFixed(2)} - $${p.toFixed(2)} = $${totalInterest.toFixed(2)}. Effective Annual Rate (APY) = ${apy.toFixed(2)}%.`,
          },
        ],
        explanation: `Compound interest generates exponential growth because interest earned in each period is added to principal for subsequent periods.`,
      };
    },
    relatedCalculators: ["loan-emi", "sip-investment"],
    relatedConcepts: ["compound-interest-concept", "time-value-of-money"],
  },

  // 3. SIP (Systematic Investment Plan) Growth
  {
    id: "sip-investment",
    name: "SIP (Systematic Investment Plan) Wealth Builder",
    slug: "sip-investment",
    category: "finance-investments",
    domain: "finance",
    description: "Calculate maturity amount and wealth gain from periodic monthly recurring investments.",
    keywords: ["sip", "mutual fund", "recurring deposit", "investment", "wealth", "systematic investment"],
    formula: {
      name: "SIP Future Value Formula",
      latex: "M = P \\times \\frac{(1 + i)^n - 1}{i} \\times (1 + i)",
      variables: [
        { symbol: "P", meaning: "Monthly Investment amount" },
        { symbol: "i", meaning: "Monthly expected rate of return (r/12)" },
        { symbol: "n", meaning: "Total number of monthly deposits" },
      ],
    },
    inputs: [
      { key: "monthly", label: "Monthly Investment Amount", type: "number", defaultValue: 5000, required: true },
      { key: "returnRate", label: "Expected Annual Return (% p.a.)", type: "number", defaultValue: 12.0, required: true },
      { key: "years", label: "Investment Duration (Years)", type: "number", defaultValue: 10, required: true },
    ],
    sampleInputs: [
      { label: "$500/mo at 12% for 10 Years", values: { monthly: 500, returnRate: 12, years: 10 } },
      { label: "$1,000/mo at 14% for 15 Years", values: { monthly: 1000, returnRate: 14, years: 15 } },
    ],
    calculate: (input) => {
      const p = Number(input.monthly) || 0;
      const annualR = Number(input.returnRate) || 0;
      const years = Number(input.years) || 1;

      const n = years * 12;
      const i = annualR / 12 / 100;

      const totalInvested = p * n;
      let futureVal = 0;

      if (i === 0) {
        futureVal = totalInvested;
      } else {
        futureVal = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      }

      const wealthGain = futureVal - totalInvested;

      return {
        status: "calculated",
        input: `SIP: $${p}/mo at ${annualR}% for ${years} yrs`,
        result: { futureVal, totalInvested, wealthGain },
        displayResult: `Total Value: $${futureVal.toFixed(2)} | Invested: $${totalInvested.toFixed(2)} | Wealth Gain: $${wealthGain.toFixed(2)}`,
        steps: [
          {
            title: "Investment Breakdown",
            text: `Total ${n} installments of $${p} = $${totalInvested.toFixed(2)} invested.`,
          },
          {
            title: "Future Value Computation",
            text: `Maturity Value = $${futureVal.toFixed(2)}. Net estimated gain = $${wealthGain.toFixed(2)} (${((wealthGain / totalInvested) * 100).toFixed(1)}% profit).`,
            latex: `M = ${p} \\times \\frac{(1 + ${i.toFixed(4)})^{${n}} - 1}{${i.toFixed(4)}} \\times (1 + ${i.toFixed(4)}) = \\$${futureVal.toFixed(2)}`,
          },
        ],
        explanation: `Systematic investing benefits from dollar-cost averaging and regular compounding over long investment horizons.`,
      };
    },
    relatedCalculators: ["compound-interest", "loan-emi"],
    relatedConcepts: ["time-value-of-money"],
  },

  // 4. Tip & Bill Splitter
  {
    id: "tip-split",
    name: "Tip & Bill Splitter",
    slug: "tip-split",
    category: "finance-business",
    domain: "finance",
    description: "Calculate tip amount, total restaurant bill, and equal per-person split with round-up options.",
    keywords: ["tip", "bill split", "restaurant", "gratuity", "split bill", "dining"],
    inputs: [
      { key: "bill", label: "Bill Subtotal ($)", type: "number", defaultValue: 85.50, required: true },
      { key: "tipPercent", label: "Tip Percentage (%)", type: "number", defaultValue: 18, required: true },
      { key: "people", label: "Number of People", type: "number", defaultValue: 3, required: true, min: 1 },
    ],
    sampleInputs: [
      { label: "$85.50 bill, 18% tip, 3 people", values: { bill: 85.5, tipPercent: 18, people: 3 } },
      { label: "$140.00 bill, 20% tip, 4 people", values: { bill: 140, tipPercent: 20, people: 4 } },
    ],
    calculate: (input) => {
      const bill = Number(input.bill) || 0;
      const tipPct = Number(input.tipPercent) || 0;
      const people = Math.max(1, Math.round(Number(input.people) || 1));

      const tipAmount = (bill * tipPct) / 100;
      const total = bill + tipAmount;
      const perPerson = total / people;
      const tipPerPerson = tipAmount / people;

      return {
        status: "calculated",
        input: `Bill: $${bill.toFixed(2)}, Tip: ${tipPct}%, People: ${people}`,
        result: { tipAmount, total, perPerson, tipPerPerson },
        displayResult: `Per Person: $${perPerson.toFixed(2)} | Total Bill + Tip: $${total.toFixed(2)} (Tip: $${tipAmount.toFixed(2)})`,
        steps: [
          {
            title: "Tip Calculation",
            text: `Tip = $${bill.toFixed(2)} × ${tipPct}% = $${tipAmount.toFixed(2)}`,
          },
          {
            title: "Total & Per Person",
            text: `Total = $${total.toFixed(2)}. Split among ${people} people = $${perPerson.toFixed(2)} each.`,
          },
        ],
        verification: {
          passed: Math.abs(perPerson * people - total) < 0.05,
          detail: `Verification: $${perPerson.toFixed(2)} × ${people} = $${(perPerson * people).toFixed(2)} (matches total).`,
        },
      };
    },
    relatedCalculators: ["compound-interest"],
  },
];
