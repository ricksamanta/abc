/**
 * CalcRick Knowledge Hub View
 * Directory of Formulas, Rules, Theorems, Laws & Concepts with KaTeX rendering
 */

import React, { useState } from "react";
import { Search, BookOpen, ArrowRight, Sparkles, Filter } from "lucide-react";
import { KNOWLEDGE_ITEMS } from "@/content/knowledgeGraph";
import { MathView } from "@/components/common/MathView";
import { useAppState } from "@/state/useAppState";

export const KnowledgeHubView: React.FC = () => {
  const { setActiveView, setActiveKnowledgeId, setActiveCalculatorId } = useAppState();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const types = [
    { id: "all", label: "All Items" },
    { id: "formula", label: "Formulas" },
    { id: "theorem", label: "Theorems" },
    { id: "law", label: "Laws" },
    { id: "rule", label: "Rules" },
    { id: "concept", label: "Concepts" },
  ];

  const filtered = KNOWLEDGE_ITEMS.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  const handleOpenDetail = (id: string) => {
    setActiveKnowledgeId(id);
    setActiveView("knowledge-detail");
  };

  const handleOpenCalc = (calcId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Formulas, Theorems & Rules Hub
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Deep academic references with derivations, conditions of validity, and linked solvers.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {types.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all backdrop-blur-xl ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-purple-400/40"
                    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas or rules..."
            className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-purple-400/60 placeholder-white/30"
          />
        </div>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenDetail(item.id)}
            className="p-6 md:p-7 rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-400/40 backdrop-blur-3xl text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  {item.domain} • {item.category}
                </span>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-lg bg-white/5 text-purple-200 border border-white/10">
                  {item.type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mt-2 group-hover:text-purple-200 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>

              {item.latex && (
                <div className="mt-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <MathView latex={item.latex} className="text-base text-purple-200" />
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-white/60 font-medium group-hover:text-white flex items-center gap-1 transition-colors">
                Read Theory & Examples <ArrowRight className="w-3 h-3" />
              </span>

              {item.linkedCalculatorId && (
                <button
                  onClick={(e) => handleOpenCalc(item.linkedCalculatorId!, e)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 border border-white/10 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Solver</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
