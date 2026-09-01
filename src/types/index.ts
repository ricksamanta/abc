/**
 * CalcRick Core Types & Interfaces
 * Master Specification v2.0
 * Creator: Rick Samanta (ricksamantaz@proton.me)
 */

export type CalculationStatus =
  | "ready"
  | "calculated"
  | "approximate"
  | "needs_input"
  | "invalid"
  | "unsupported"
  | "requires_network"
  | "warning";

export type CalculationMode = "quick" | "learn" | "exam";
export type AngleUnit = "deg" | "rad" | "grad";
export type ThemeMode = "dark" | "light" | "system";
export type PrecisionMode = "auto" | "2" | "3" | "4" | "6" | "10" | "custom";
export type NumberFormat = "standard" | "scientific" | "engineering";

export interface CalculationStep {
  title?: string;
  expression?: string;
  latex?: string;
  text: string;
  detail?: string;
}

export interface VerificationResult {
  passed: boolean;
  checkType?: string;
  detail: string;
  expected?: string | number;
  actual?: string | number;
}

export interface Assumption {
  name: string;
  value: string;
  description?: string;
  isDefault?: boolean;
}

export interface FormulaRef {
  id?: string;
  name: string;
  latex: string;
  description?: string;
  variables?: { symbol: string; meaning: string; unit?: string }[];
}

export interface RelatedContentRef {
  id: string;
  title: string;
  type: "calculator" | "formula" | "rule" | "theorem" | "law" | "concept" | "practice";
  category?: string;
  description?: string;
}

export interface CalculationResult<T = unknown> {
  status: CalculationStatus;
  input: string;
  normalizedInput?: string;
  result: T;
  displayResult?: string;
  exactResult?: string;
  approximateResult?: string;
  unit?: string;
  isExact?: boolean;
  formula?: FormulaRef;
  steps?: CalculationStep[];
  assumptions?: Assumption[];
  verification?: VerificationResult;
  explanation?: string;
  warnings?: string[];
  relatedContent?: RelatedContentRef[];
  examFormat?: {
    given: { label: string; value: string; unit?: string }[];
    required: string;
    formulaLatex: string;
    substitutionLatex: string;
    calculationSteps: string[];
    finalAnswer: string;
    unit?: string;
  };
}

export interface InputFieldDef {
  key: string;
  label: string;
  type: "number" | "text" | "select" | "matrix" | "vector" | "radio" | "boolean";
  defaultValue?: any;
  placeholder?: string;
  description?: string;
  unit?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface CalculatorDefinition<TInput = any, TOutput = any> {
  id: string;
  name: string;
  slug: string;
  category:
    | "standard"
    | "arithmetic"
    | "percentages"
    | "algebra"
    | "geometry"
    | "trigonometry"
    | "calculus"
    | "matrices"
    | "vectors"
    | "number-theory"
    | "statistics"
    | "complex-numbers"
    | "sequences"
    | "physics-mechanics"
    | "physics-electricity"
    | "physics-waves"
    | "chemistry"
    | "engineering-electrical"
    | "engineering-mechanical"
    | "engineering-civil"
    | "finance-interest"
    | "finance-loans"
    | "finance-investments"
    | "finance-business"
    | "programming-bases"
    | "programming-bitwise"
    | "programming-networking"
    | "converters-units"
    | "converters-currency"
    | "converters-datetime";
  domain: "mathematics" | "science" | "engineering" | "finance" | "programming" | "converters" | "standard";
  description: string;
  keywords: string[];
  iconName?: string;
  formula?: FormulaRef;
  inputs?: InputFieldDef[];
  defaultValues?: Partial<TInput>;
  validate?: (input: TInput) => { success: boolean; error?: string };
  calculate: (input: TInput, options?: { angleUnit?: AngleUnit; precision?: number }) => CalculationResult<TOutput>;
  steps?: (input: TInput, result: TOutput, options?: { angleUnit?: AngleUnit }) => CalculationStep[];
  verify?: (input: TInput, result: TOutput, options?: { angleUnit?: AngleUnit }) => VerificationResult;
  explain?: (input: TInput, result: TOutput, options?: { angleUnit?: AngleUnit }) => string;
  relatedCalculators?: string[];
  relatedConcepts?: string[];
  relatedFormulas?: string[];
  practiceTopic?: string;
  sampleInputs?: { label: string; values: TInput }[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  calculatorId: string;
  calculatorName: string;
  category: string;
  rawInput: string;
  formattedInput: string;
  resultString: string;
  exactString?: string;
  unit?: string;
  mode: CalculationMode;
  notes?: string;
  inputsState?: any;
}

export interface FavoriteEntry {
  id: string;
  targetId: string;
  targetType: "calculator" | "formula" | "rule" | "theorem" | "law" | "concept";
  title: string;
  category: string;
  savedAt: number;
}

export interface WorkspaceItem {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  items: {
    calculatorId: string;
    inputs: any;
    resultSummary: string;
    note?: string;
  }[];
}

export interface KnowledgeItem {
  id: string;
  slug: string;
  title: string;
  type: "formula" | "rule" | "theorem" | "law" | "concept";
  category: string;
  domain: "mathematics" | "science" | "engineering" | "finance" | "programming";
  summary: string;
  latex?: string;
  statement?: string;
  conditions?: string[];
  variables?: { symbol: string; meaning: string; unit?: string }[];
  whenToUse?: string;
  commonMistakes?: string[];
  derivationOrWhy?: string;
  workedExample?: {
    problem: string;
    given?: string;
    solutionSteps: string[];
    answer: string;
  };
  linkedCalculatorId?: string;
  relatedItemIds?: string[];
  tags: string[];
}

export interface PracticeQuestion {
  id: string;
  topic: string;
  domain: string;
  difficulty: "easy" | "medium" | "hard" | "advanced";
  question: string;
  latex?: string;
  given?: { label: string; value: string }[];
  correctAnswer: string | number;
  tolerance?: number;
  unit?: string;
  options?: string[]; // for multiple choice where applicable
  explanation: string;
  steps: string[];
  hints: string[];
  relatedCalculatorId?: string;
  relatedConceptId?: string;
}
