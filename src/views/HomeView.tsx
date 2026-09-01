/**
 * CalcRick Home Hub View
 * Universal smart search bar, domain tiles, quick tools, daily concept spotlight
 */

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Calculator,
  Compass,
  GraduationCap,
  Binary,
  Atom,
  Cpu,
  Coins,
  Code2,
  RefreshCw,
  Zap,
  BookOpen,
} from "lucide-react";
import { useAppState } from "@/state/useAppState";
import { routeUniversalInput } from "@/engine/intent/router";
import { MASTER_CALCULATORS } from "@/engine/registry";
import { KNOWLEDGE_ITEMS } from "@/content/knowledgeGraph";
import { MathView } from "@/components/common/MathView";

export const HomeView: React.FC = () => {
  const { setActiveView, setActiveCalculatorId, setActiveKnowledgeId } = useAppState();
  const [smartQuery, setSmartQuery] = useState("");
  const [routedResult, setRoutedResult] = useState<any>(null);

  const handleSmartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartQuery.trim()) return;
    const match = routeUniversalInput(smartQuery);
    setRoutedResult(match);
  };

  const handleLaunchCalc = (calcId: string) => {
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  const handleLaunchKnowledge = (kId: string) => {
    setActiveKnowledgeId(kId);
    setActiveView("knowledge-detail");
  };

  const domains = [
    {
      id: "math",
      title: "Mathematics",
      desc: "GCD/LCM, Quadratic, Prime Factors, Matrix & Pythagorean",
      icon: Binary,
      color: "from-blue-600 to-indigo-600",
      calcCount: 8,
    },
    {
      id: "science",
      title: "Science & Physics",
      desc: "Newton's 2nd Law, Energy, Ohm's Law, Molar Mass & Gas Law",
      icon: Atom,
      color: "from-purple-600 to-pink-600",
      calcCount: 5,
    },
    {
      id: "engineering",
      title: "Engineering",
      desc: "Voltage Dividers, RC Time Constants, Stress & Strain",
      icon: Cpu,
      color: "from-amber-600 to-orange-600",
      calcCount: 3,
    },
    {
      id: "finance",
      title: "Finance & Money",
      desc: "Loan EMI, Compound Interest, SIP Growth & Tip Splitting",
      icon: Coins,
      color: "from-emerald-600 to-teal-600",
      calcCount: 4,
    },
    {
      id: "programming",
      title: "Programming & CS",
      desc: "Base Conversion, Bitwise Logic & IPv4 CIDR Subnetting",
      icon: Code2,
      color: "from-cyan-600 to-blue-600",
      calcCount: 3,
    },
    {
      id: "converters",
      title: "Universal Converters",
      desc: "Length, Mass, Temperature, Digital Storage & Dates",
      icon: RefreshCw,
      color: "from-rose-600 to-pink-600",
      calcCount: 3,
    },
  ];

  const featuredCalcs = MASTER_CALCULATORS.slice(0, 6);
  const spotlightFormula = KNOWLEDGE_ITEMS[1]; // Pythagorean

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[36px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 md:p-10 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 backdrop-blur-md text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" /> High Precision Calculation Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Calculate. Convert. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200">
              Understand. Master.
            </span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/60 leading-relaxed">
            Multi-domain problem solving platform spanning Mathematics, Science, Engineering, Finance, and Programming with step-by-step reasoning and independent verification.
          </p>
        </div>

        {/* Smart Universal Input Field */}
        <form onSubmit={handleSmartSubmit} className="mt-8 relative max-w-3xl">
          <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/15 focus-within:border-purple-400/60 rounded-2xl p-2 transition-all shadow-2xl">
            <div className="pl-3 pr-2 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={smartQuery}
              onChange={(e) => setSmartQuery(e.target.value)}
              placeholder="What do you want to calculate? (e.g., GCD of 48 and 18, 2+3*4, $500000 loan at 8.5% for 5 years)"
              className="w-full bg-transparent text-sm md:text-base text-white outline-none placeholder-white/30 py-2"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <span>Solve</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Smart Query Preview Card */}
        {routedResult && (
          <div className="mt-4 p-5 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-purple-500/30 max-w-3xl animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Instant Solution</span>
              {routedResult.calculatorName && (
                <span className="text-xs text-white/50">{routedResult.calculatorName}</span>
              )}
            </div>
            <div className="text-xl md:text-2xl font-mono font-bold text-white mt-1">
              {routedResult.displayResult || routedResult.directValue}
            </div>
            {routedResult.calculatorId && (
              <button
                onClick={() => handleLaunchCalc(routedResult.calculatorId)}
                className="mt-2 text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                Open Full Interactive Workspace <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-white/50">
          <span className="font-semibold uppercase tracking-[0.2em] text-white/40">Quick prompts:</span>
          {[
            "GCD of 48 and 18",
            "x^2 - 7x + 10 = 0",
            "10 km to miles",
            "$500000 loan at 8.5% for 5 years",
            "192.168.1.50/24",
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setSmartQuery(sample);
                const m = routeUniversalInput(sample);
                setRoutedResult(m);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Calculation Domains</h2>
            <p className="text-xs text-white/50">Explore domain-tailored engines & verification rules</p>
          </div>
          <button
            onClick={() => setActiveView("calculators-hub")}
            className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            View All ({MASTER_CALCULATORS.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((dom) => {
            const Icon = dom.icon;
            return (
              <button
                key={dom.id}
                onClick={() => setActiveView("calculators-hub")}
                className="p-6 rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-400/40 backdrop-blur-3xl text-left transition-all group flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 group-hover:bg-purple-500/20 flex items-center justify-center text-purple-300 border border-white/10 mb-4 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                    {dom.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                    {dom.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                  <span>{dom.calcCount} Specialized Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning & Formula Spotlight + Rule Finder Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rule Finder Promo */}
        <div className="lg:col-span-1 bg-gradient-to-br from-purple-950/40 to-white/[0.02] backdrop-blur-3xl border border-purple-500/30 rounded-[32px] p-6 md:p-7 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Rule Finder Wizard</h3>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              Don't know which formula or law applies? Answer 2 simple questions about your given parameters and get the exact theorem + interactive solver.
            </p>
          </div>
          <button
            onClick={() => setActiveView("rule-finder")}
            className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            <span>Launch Rule Finder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Formula Spotlight */}
        <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-7 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Formula Spotlight
              </span>
              <span className="text-xs text-white/40">{spotlightFormula.domain.toUpperCase()}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold text-white">{spotlightFormula.title}</h3>
              <p className="text-xs text-white/60 mt-1">{spotlightFormula.summary}</p>
              {spotlightFormula.latex && (
                <div className="mt-3 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <MathView latex={spotlightFormula.latex} className="text-xl text-purple-200" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleLaunchKnowledge(spotlightFormula.id)}
              className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1 transition-colors"
            >
              Read Full Derivation & Conditions <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleLaunchCalc(spotlightFormula.linkedCalculatorId!)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
            >
              <span>Open Solver</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Solvers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Featured Solvers & Tools</h2>
            <p className="text-xs text-white/50">Direct access to popular verified calculators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCalcs.map((c) => (
            <button
              key={c.id}
              onClick={() => handleLaunchCalc(c.id)}
              className="p-6 rounded-[28px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-400/40 backdrop-blur-3xl text-left transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  {c.domain}
                </div>
                <h4 className="text-sm font-bold text-white mt-1 group-hover:text-purple-200 transition-colors">
                  {c.name}
                </h4>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{c.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                <span className="font-mono text-[11px] text-white/50 truncate max-w-[80%]">
                  {c.sampleInputs?.[0]?.label || "Ready"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
