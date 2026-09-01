/**
 * CalcRick Mobile Bottom Navigation Bar
 * Optimized touch targets (>= 44px) across 5 core actions
 */

import React from "react";
import { Home, Calculator, RefreshCw, BookOpen, Search } from "lucide-react";
import { useAppState } from "@/state/useAppState";

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setIsSearchOpen, setActiveCalculatorId } = useAppState();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/[0.03] backdrop-blur-3xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
      <button
        onClick={() => setActiveView("home")}
        className={`flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[48px] rounded-2xl transition-all ${
          activeView === "home" ? "text-purple-400 bg-white/10 shadow-sm" : "text-white/60 hover:text-white"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Home</span>
      </button>

      <button
        onClick={() => setActiveView("calculator")}
        className={`flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[48px] rounded-2xl transition-all ${
          activeView === "calculator" ? "text-purple-400 bg-white/10 shadow-sm" : "text-white/60 hover:text-white"
        }`}
      >
        <Calculator className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Calculate</span>
      </button>

      <button
        onClick={() => {
          setActiveCalculatorId("unit-converter");
          setActiveView("calculator");
        }}
        className={`flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[48px] rounded-2xl transition-all ${
          activeView === "calculator" ? "text-purple-400 bg-white/10 shadow-sm" : "text-white/60 hover:text-white"
        }`}
      >
        <RefreshCw className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Convert</span>
      </button>

      <button
        onClick={() => setActiveView("knowledge-hub")}
        className={`flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[48px] rounded-2xl transition-all ${
          activeView === "knowledge-hub" ? "text-purple-400 bg-white/10 shadow-sm" : "text-white/60 hover:text-white"
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Learn</span>
      </button>

      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[48px] rounded-2xl text-white/60 hover:text-white"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-1">Search</span>
      </button>
    </nav>
  );
};
