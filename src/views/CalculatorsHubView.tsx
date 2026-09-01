/**
 * CalcRick Calculators Hub
 * Full directory of all calculators with domain filtering, category tabs, and search
 */

import React, { useState } from "react";
import { Search, Calculator, ArrowRight, Binary, Atom, Cpu, Coins, Code2, RefreshCw } from "lucide-react";
import { MASTER_CALCULATORS } from "@/engine/registry";
import { useAppState } from "@/state/useAppState";

export const CalculatorsHubView: React.FC = () => {
  const { setActiveView, setActiveCalculatorId } = useAppState();
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const domains = [
    { id: "all", label: "All Calculators", icon: Calculator },
    { id: "mathematics", label: "Mathematics", icon: Binary },
    { id: "science", label: "Science & Physics", icon: Atom },
    { id: "engineering", label: "Engineering", icon: Cpu },
    { id: "finance", label: "Finance & Money", icon: Coins },
    { id: "programming", label: "Programming & CS", icon: Code2 },
    { id: "converters", label: "Unit Converters", icon: RefreshCw },
  ];

  const filtered = MASTER_CALCULATORS.filter((calc) => {
    const matchesDomain = selectedDomain === "all" || calc.domain === selectedDomain;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      calc.name.toLowerCase().includes(q) ||
      calc.description.toLowerCase().includes(q) ||
      calc.category.toLowerCase().includes(q) ||
      calc.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesDomain && matchesSearch;
  });

  const handleLaunch = (id: string) => {
    setActiveCalculatorId(id);
    setActiveView("calculator");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          All Calculators & Solvers
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Explore specialized deterministic solvers covering {MASTER_CALCULATORS.length} multi-domain tools.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {domains.map((dom) => {
            const Icon = dom.icon;
            const isSelected = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all backdrop-blur-xl ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-purple-400/40"
                    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{dom.label}</span>
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
            placeholder="Filter calculators..."
            className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-purple-400/60 placeholder-white/30"
          />
        </div>
      </div>

      {/* Grid of Calculators */}
      {filtered.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-12 text-center text-white/60 shadow-xl">
          <p className="text-base">No calculators found matching your query.</p>
          <button
            onClick={() => {
              setSelectedDomain("all");
              setSearchQuery("");
            }}
            className="mt-3 text-xs text-purple-300 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((calc) => (
            <button
              key={calc.id}
              onClick={() => handleLaunch(calc.id)}
              className="p-6 rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-400/40 backdrop-blur-3xl text-left transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                    {calc.domain} • {calc.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-purple-200 transition-colors">
                  {calc.name}
                </h3>
                <p className="text-xs text-white/50 mt-1.5 line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                <div className="flex flex-wrap gap-1 max-w-[80%] overflow-hidden">
                  {calc.keywords.slice(0, 2).map((k, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-white/60 border border-white/5">
                      {k}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
