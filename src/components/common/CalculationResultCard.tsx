/**
 * CalcRick Unified Calculation Result View
 * Implements Quick, Learn & Exam Modes with Verification Engine & KaTeX Steps
 * Follows PD-1 (Accuracy), PD-5 (Real Steps), PD-6 (Exact vs Approx), PD-7 (Assumptions)
 */

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  BookOpen,
  Printer,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { CalculationMode, CalculationResult } from "@/types";
import { MathView } from "./MathView";
import { useAppState } from "@/state/useAppState";

interface CalculationResultCardProps {
  result: CalculationResult;
  title?: string;
  onExploreConcept?: (conceptId: string) => void;
  onExploreCalculator?: (calcId: string) => void;
}

export const CalculationResultCard: React.FC<CalculationResultCardProps> = ({
  result,
  title,
  onExploreConcept,
  onExploreCalculator,
}) => {
  const { calculationMode, setCalculationMode } = useAppState();
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!result || result.status === "invalid") {
    return (
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 text-amber-300 shadow-xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <h4 className="font-semibold text-lg">Input Notice</h4>
        </div>
        <p className="mt-2 text-sm text-white/70">
          {result?.warnings?.[0] || "Please enter valid numeric parameters to compute."}
        </p>
      </div>
    );
  }

  const isExact = result.isExact ?? false;
  const displayVal = result.displayResult || String(result.result || "");

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-[#F5F5F7]">
      {/* Top Bar: Mode Selector & Actions */}
      <div className="bg-white/[0.04] px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10">
          {(["quick", "learn", "exam"] as CalculationMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setCalculationMode(mode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                calculationMode === mode
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {mode} Mode
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isExact ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Exact Result
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              ≈ Approximate
            </span>
          )}

          <button
            onClick={() => handleCopy(displayVal)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Copy Result"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Print Academic Format"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Result Display */}
      <div className="p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold mb-1">
          {title || "Calculation Result"}
        </div>
        <div className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-mono break-all py-1">
          {displayVal}
        </div>
        {result.input && (
          <div className="text-xs text-white/50 font-mono mt-1">
            Evaluated from: <span className="text-white/80">{result.input}</span>
          </div>
        )}

        {/* QUICK MODE */}
        {calculationMode === "quick" && result.explanation && (
          <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/70">
            {result.explanation}
          </div>
        )}

        {/* LEARN MODE */}
        {calculationMode === "learn" && (
          <div className="mt-6 space-y-6 pt-6 border-t border-white/10">
            {/* Formula Card */}
            {result.formula && (
              <div className="bg-white/[0.04] p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" /> Governing Formula
                </div>
                <div className="text-sm font-semibold text-white mb-2">{result.formula.name}</div>
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 inline-block">
                  <MathView latex={result.formula.latex} className="text-lg text-purple-200" />
                </div>
                {result.formula.description && (
                  <p className="text-xs text-white/60 mt-2">{result.formula.description}</p>
                )}
              </div>
            )}

            {/* Step-by-Step Breakdown */}
            {result.steps && result.steps.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" /> Step-by-Step Solution
                </h5>
                <div className="space-y-3">
                  {result.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 transition-all hover:border-purple-400/40 backdrop-blur-md"
                    >
                      <div className="text-xs font-semibold text-purple-300 mb-1">
                        {step.title || `Step ${idx + 1}`}
                      </div>
                      <div className="text-sm text-white/90 whitespace-pre-line">{step.text}</div>
                      {step.latex && (
                        <div className="mt-2 p-2 bg-black/30 rounded-xl border border-white/10 inline-block">
                          <MathView latex={step.latex} className="text-purple-200" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Engine Output */}
            {result.verification && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 backdrop-blur-md ${
                  result.verification.passed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                }`}
              >
                <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {result.verification.passed ? "Independently Verified" : "Verification Warning"}
                  </div>
                  <div className="text-sm text-white/80 mt-0.5">
                    {result.verification.detail}
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            {result.explanation && (
              <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Why It Works
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{result.explanation}</p>
              </div>
            )}

            {/* Assumptions & Conventions */}
            {result.assumptions && result.assumptions.length > 0 && (
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
                <div className="font-semibold text-white/40 uppercase tracking-[0.2em] mb-2">
                  Assumptions & Conventions Used
                </div>
                <div className="space-y-1.5">
                  {result.assumptions.map((a, i) => (
                    <div key={i} className="flex justify-between items-start text-white/80">
                      <span className="font-medium text-white">{a.name}:</span>
                      <span className="text-white/50 text-right ml-2">{a.value} ({a.description})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXAM / ACADEMIC MODE */}
        {calculationMode === "exam" && (
          <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-white/10 font-mono text-sm space-y-4 backdrop-blur-md">
            <div className="text-center font-bold text-base text-purple-300 uppercase tracking-widest pb-2 border-b border-white/10">
              Academic Problem Solution
            </div>

            {result.examFormat ? (
              <>
                <div>
                  <span className="text-purple-300 font-bold">GIVEN:</span>
                  <ul className="list-disc list-inside mt-1 text-white/80">
                    {result.examFormat.given.map((g, idx) => (
                      <li key={idx}>
                        {g.label} = {g.value} {g.unit || ""}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-purple-300 font-bold">REQUIRED:</span>
                  <div className="text-white/90 mt-0.5">{result.examFormat.required}</div>
                </div>

                <div>
                  <span className="text-purple-300 font-bold">FORMULA:</span>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/10 mt-1 inline-block">
                    <MathView latex={result.examFormat.formulaLatex} />
                  </div>
                </div>

                <div>
                  <span className="text-purple-300 font-bold">SUBSTITUTION:</span>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/10 mt-1 inline-block">
                    <MathView latex={result.examFormat.substitutionLatex} />
                  </div>
                </div>

                <div>
                  <span className="text-purple-300 font-bold">CALCULATION:</span>
                  <div className="space-y-1 text-white/80 mt-1">
                    {result.examFormat.calculationSteps.map((step, i) => (
                      <div key={i}>{step}</div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-base font-bold text-emerald-400">
                  FINAL ANSWER: {result.examFormat.finalAnswer} {result.examFormat.unit || ""}
                </div>
              </>
            ) : (
              <div className="space-y-3 text-white/90">
                <div>
                  <span className="text-purple-300 font-bold">INPUT EXPRESSION:</span> {result.input}
                </div>
                <div>
                  <span className="text-purple-300 font-bold">EVALUATION:</span> {displayVal}
                </div>
                {result.steps?.map((s, idx) => (
                  <div key={idx}>
                    <span className="text-purple-300 font-bold">STEP {idx + 1}:</span> {s.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Content Links */}
      {result.relatedContent && result.relatedContent.length > 0 && (
        <div className="bg-white/[0.04] px-6 py-4 border-t border-white/10 flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase font-semibold text-white/40 tracking-[0.2em]">Explore Connected:</span>
          {result.relatedContent.map((rel) => (
            <button
              key={rel.id}
              onClick={() => {
                if (rel.type === "calculator" && onExploreCalculator) onExploreCalculator(rel.id);
                else if (onExploreConcept) onExploreConcept(rel.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-purple-600/30 text-xs font-medium text-white border border-white/10 backdrop-blur-md transition-all"
            >
              {rel.title} <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
