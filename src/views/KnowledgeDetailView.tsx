/**
 * CalcRick Knowledge Detail View
 * Deep pedagogical page for formulas, theorems, rules, and concepts
 */

import React from "react";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  CheckCircle,
  FileText,
  Heart,
} from "lucide-react";
import { useAppState } from "@/state/useAppState";
import { getKnowledgeById } from "@/content/knowledgeGraph";
import { MathView } from "@/components/common/MathView";

export const KnowledgeDetailView: React.FC = () => {
  const { activeKnowledgeId, setActiveView, setActiveCalculatorId, isFavorite, toggleFavorite } = useAppState();

  const item = getKnowledgeById(activeKnowledgeId);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-[#9A9AA2]">
        <p>Concept or formula not found.</p>
        <button
          onClick={() => setActiveView("knowledge-hub")}
          className="mt-4 text-xs text-[#7C6EF6] hover:underline"
        >
          Back to Knowledge Hub
        </button>
      </div>
    );
  }

  const fav = isFavorite(item.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back Button */}
      <button
        onClick={() => setActiveView("knowledge-hub")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Knowledge Hub</span>
      </button>

      {/* Main Detail Header Card */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-purple-300 tracking-[0.2em]">
                {item.domain} • {item.category}
              </span>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-lg bg-white/5 text-purple-200 border border-white/10">
                {item.type}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
              {item.title}
            </h1>
            <p className="text-sm text-white/60 mt-2 leading-relaxed">{item.summary}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(item.id, item.type as any, item.title, item.category)}
              className={`p-3 rounded-2xl border transition-all ${
                fav
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                  : "bg-white/[0.04] text-white/60 hover:text-white border-white/10 hover:bg-white/[0.08]"
              }`}
              title={fav ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-4 h-4 ${fav ? "fill-rose-400" : ""}`} />
            </button>

            {item.linkedCalculatorId && (
              <button
                onClick={() => {
                  setActiveCalculatorId(item.linkedCalculatorId!);
                  setActiveView("calculator");
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Linked Solver</span>
              </button>
            )}
          </div>
        </div>

        {/* Latex Display */}
        {item.latex && (
          <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
            <div className="text-xs uppercase font-bold text-white/40 mb-2 tracking-[0.2em]">Mathematical Formulation</div>
            <MathView latex={item.latex} className="text-2xl text-purple-200" />
          </div>
        )}

        {/* Formal Statement */}
        {item.statement && (
          <div className="mt-6 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <div className="text-xs uppercase font-bold text-purple-300 tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Formal Statement
            </div>
            <p className="text-sm text-white/90 leading-relaxed font-serif italic">{item.statement}</p>
          </div>
        )}

        {/* Variables Meaning */}
        {item.variables && item.variables.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs uppercase font-bold text-white/40 tracking-[0.2em] mb-3">
              Variables & Units
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.variables.map((v, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between text-xs backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-300 text-sm">{v.symbol}</span>
                    <span className="text-white/80">{v.meaning}</span>
                  </div>
                  {v.unit && <span className="text-[11px] text-white/40 font-mono">{v.unit}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditions & Constraints */}
        {item.conditions && item.conditions.length > 0 && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md">
            <h3 className="text-xs uppercase font-bold text-amber-300 tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Conditions of Validity & Boundaries
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-white/80">
              {item.conditions.map((cond, i) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Derivation / Why it Works */}
        {item.derivationOrWhy && (
          <div className="mt-6 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <h3 className="text-xs uppercase font-bold text-purple-300 tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Why It Works & Derivation
            </h3>
            <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line">
              {item.derivationOrWhy}
            </p>
          </div>
        )}

        {/* Worked Example */}
        {item.workedExample && (
          <div className="mt-6 p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-emerald-400 tracking-[0.2em]">
              <CheckCircle className="w-4 h-4" /> Worked Academic Example
            </div>
            <div className="text-sm font-semibold text-white">{item.workedExample.problem}</div>
            <div className="space-y-1.5 text-xs text-white/80 font-mono">
              {item.workedExample.solutionSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  {step}
                </div>
              ))}
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-300">
              Result: {item.workedExample.answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
