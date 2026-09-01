/**
 * CalcRick Master Calculator Registry
 * Central registry uniting Mathematics, Science, Engineering, Finance, Programming, Converters
 */

import { CalculatorDefinition } from "@/types";
import { mathCalculators } from "./mathCalculators";
import { scienceCalculators } from "./scienceCalculators";
import { engineeringCalculators } from "./engineeringCalculators";
import { financeCalculators } from "./financeCalculators";
import { programmingCalculators } from "./programmingCalculators";
import { converterCalculators } from "./converterCalculators";

export const MASTER_CALCULATORS: CalculatorDefinition[] = [
  ...mathCalculators,
  ...scienceCalculators,
  ...engineeringCalculators,
  ...financeCalculators,
  ...programmingCalculators,
  ...converterCalculators,
];

export const CALCULATORS_BY_ID = new Map<string, CalculatorDefinition>(
  MASTER_CALCULATORS.map((calc) => [calc.id, calc])
);

export const CALCULATORS_BY_SLUG = new Map<string, CalculatorDefinition>(
  MASTER_CALCULATORS.map((calc) => [calc.slug, calc])
);

export function getCalculatorById(id: string): CalculatorDefinition | undefined {
  return CALCULATORS_BY_ID.get(id);
}

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return CALCULATORS_BY_SLUG.get(slug);
}

export function getCalculatorsByDomain(domain: string): CalculatorDefinition[] {
  return MASTER_CALCULATORS.filter((c) => c.domain === domain);
}

export function getCalculatorsByCategory(category: string): CalculatorDefinition[] {
  return MASTER_CALCULATORS.filter((c) => c.category === category);
}

export function searchCalculators(query: string): CalculatorDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return MASTER_CALCULATORS;

  return MASTER_CALCULATORS.filter((calc) => {
    return (
      calc.name.toLowerCase().includes(q) ||
      calc.description.toLowerCase().includes(q) ||
      calc.keywords.some((k) => k.toLowerCase().includes(q)) ||
      calc.category.toLowerCase().includes(q) ||
      calc.domain.toLowerCase().includes(q)
    );
  });
}
