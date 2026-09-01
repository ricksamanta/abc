/**
 * CalcRick Shell Modals
 * Global Search (⌘K), Settings & Preferences, and Creator About Modal
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Sparkles,
  Calculator,
  BookOpen,
  ArrowRight,
  Sliders,
  Mail,
  User,
  Shield,
  Zap,
} from "lucide-react";
import { useAppState } from "@/state/useAppState";
import { searchCalculators } from "@/engine/registry";
import { searchKnowledge } from "@/content/knowledgeGraph";
import { routeUniversalInput } from "@/engine/intent/router";

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveView, setActiveCalculatorId, setActiveKnowledgeId } = useAppState();
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const calcs = searchCalculators(query).slice(0, 5);
  const knowledge = searchKnowledge(query).slice(0, 4);
  const intent = query.length > 2 ? routeUniversalInput(query) : null;

  const handleSelectCalc = (id: string) => {
    setActiveCalculatorId(id);
    setActiveView("calculator");
    setIsSearchOpen(false);
  };

  const handleSelectKnowledge = (id: string) => {
    setActiveKnowledgeId(id);
    setActiveView("knowledge-detail");
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0510]/80 backdrop-blur-2xl flex items-start justify-center p-4 pt-16 md:pt-24 animate-in fade-in duration-150">
      <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a math problem, formula, or calculator name..."
            className="w-full bg-transparent text-base text-white outline-none placeholder-white/40"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Intent Direct Solution if recognized */}
          {intent && intent.type === "calculator_route" && intent.computedResult && (
            <div className="bg-white/[0.05] border border-purple-500/30 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Instant Smart Solution
                </span>
                <span className="text-xs text-white/50">{intent.calculatorName}</span>
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-white">
                {intent.displayResult}
              </div>
              <button
                onClick={() => handleSelectCalc(intent.calculatorId!)}
                className="mt-3 text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                Open Full Step-by-Step Solver <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Calculators Group */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 px-2 mb-1.5">
              Calculators & Tools ({calcs.length})
            </div>
            <div className="space-y-1">
              {calcs.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => handleSelectCalc(calc.id)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.06] text-left transition-all group backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-purple-500/20 text-purple-300 border border-white/10">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{calc.name}</div>
                      <div className="text-xs text-white/50 line-clamp-1">{calc.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Knowledge Group */}
          {knowledge.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 px-2 mb-1.5">
                Formulas, Laws & Concepts ({knowledge.length})
              </div>
              <div className="space-y-1">
                {knowledge.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => handleSelectKnowledge(k.id)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.06] text-left transition-all group backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-purple-500/20 text-purple-300 border border-white/10">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{k.title}</div>
                        <div className="text-xs text-white/50 line-clamp-1">{k.summary}</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-purple-300 border border-white/10">
                      {k.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    theme,
    setTheme,
    calculationMode,
    setCalculationMode,
    angleUnit,
    setAngleUnit,
    precisionMode,
    setPrecisionMode,
  } = useAppState();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0510]/80 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Calculation Preferences</h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Setting */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Visual Theme</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme("dark")}
              className={`p-3 rounded-2xl border text-sm font-semibold transition-all ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/[0.03] text-white/70 border-white/10 hover:bg-white/[0.06]"
              }`}
            >
              Dark Frosted (Default)
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`p-3 rounded-2xl border text-sm font-semibold transition-all ${
                theme === "light"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/[0.03] text-white/70 border-white/10 hover:bg-white/[0.06]"
              }`}
            >
              Light Theme
            </button>
          </div>
        </div>

        {/* Default Calculation Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Default Learning Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {(["quick", "learn", "exam"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setCalculationMode(m)}
                className={`py-2.5 rounded-2xl border text-xs font-bold uppercase transition-all ${
                  calculationMode === m
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    : "bg-white/[0.03] text-white/70 border-white/10 hover:bg-white/[0.06]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Default Angle Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Trigonometry Angle Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {(["deg", "rad", "grad"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setAngleUnit(u)}
                className={`py-2.5 rounded-2xl border text-xs font-bold uppercase transition-all ${
                  angleUnit === u
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    : "bg-white/[0.03] text-white/70 border-white/10 hover:bg-white/[0.06]"
                }`}
              >
                {u === "deg" ? "Degrees (°)" : u === "rad" ? "Radians" : "Gradians"}
              </button>
            ))}
          </div>
        </div>

        {/* Precision Setting */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Display Precision</label>
          <select
            value={precisionMode}
            onChange={(e) => setPrecisionMode(e.target.value as any)}
            className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-sm text-white outline-none focus:border-purple-400/60 transition-colors"
          >
            <option value="auto">Auto (Full Precision without trailing zeros)</option>
            <option value="2">2 Decimal Places (0.00)</option>
            <option value="3">3 Decimal Places (0.000)</option>
            <option value="4">4 Decimal Places (0.0000)</option>
            <option value="6">6 Decimal Places (0.000000)</option>
          </select>
        </div>

        <button
          onClick={() => setIsSettingsOpen(false)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 transition-all"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};

export const AboutModal: React.FC = () => {
  const { isAboutOpen, setIsAboutOpen } = useAppState();

  if (!isAboutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0510]/80 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl text-[#F5F5F7]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">About CalcRick</h3>
              <div className="text-xs text-purple-300 font-medium">Calculate. Convert. Understand. Master.</div>
            </div>
          </div>
          <button
            onClick={() => setIsAboutOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-white/70 leading-relaxed">
          CalcRick is a multi-domain calculation, conversion, verification, and mathematical learning platform. It unifies high-precision deterministic engines with transparent step-by-step reasoning, independent verification, and a comprehensive knowledge ecosystem.
        </p>

        {/* Creator Info as specified in §1.2 */}
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">Creator & Author</div>
          <div className="flex items-center gap-2 text-sm text-white font-semibold">
            <User className="w-4 h-4 text-white/50" />
            Rick Samanta
          </div>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Mail className="w-4 h-4 text-white/50" />
            <a href="mailto:ricksamantaz@proton.me" className="text-purple-300 hover:underline">
              ricksamantaz@proton.me
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Zero unsafe eval()</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Exact Precision Model</span>
          </div>
        </div>

        <button
          onClick={() => setIsAboutOpen(false)}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 backdrop-blur-md transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
