/**
 * CalcRick Header Shell
 * Brand, Global Search Trigger, Quick Preferences & Actions
 */

import React from "react";
import {
  Search,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  Sparkles,
  Command,
} from "lucide-react";
import { useAppState } from "@/state/useAppState";

export const Header: React.FC = () => {
  const {
    theme,
    setTheme,
    setIsSearchOpen,
    setIsSettingsOpen,
    setIsAboutOpen,
    angleUnit,
    setAngleUnit,
    setActiveView,
  } = useAppState();

  return (
    <header className="sticky top-0 z-40 bg-white/[0.02] backdrop-blur-3xl border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Brand Identity */}
      <button
        onClick={() => setActiveView("home")}
        className="flex items-center gap-3 text-left group transition-transform active:scale-95"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg md:text-xl tracking-tight text-white">
              Calc<span className="text-purple-400">Rick</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-white/10 text-purple-300 border border-white/10 backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              v2.0
            </span>
          </div>
          <div className="text-[11px] text-white/50 font-medium hidden sm:block">
            Calculate. Convert. Understand. Master.
          </div>
        </div>
      </button>

      {/* Global Quick Search Bar */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="hidden md:flex items-center justify-between w-72 lg:w-96 px-4 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs text-white/60 hover:text-white backdrop-blur-2xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-purple-400" />
          <span className="font-medium">Search calculators, formulas, theorems...</span>
        </div>
        <kbd className="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-mono text-white/70 border border-white/10">
          ⌘K
        </kbd>
      </button>

      {/* Quick Action Icons */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 backdrop-blur-xl transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 backdrop-blur-xl transition-colors"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 backdrop-blur-xl transition-colors"
          title="Settings & Preferences"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* About */}
        <button
          onClick={() => setIsAboutOpen(true)}
          className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 backdrop-blur-xl transition-colors"
          title="About CalcRick & Creator"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
