/**
 * CalcRick Sidebar Navigation
 * Desktop & Tablet navigation with collapsible categories and keyboard accessible links
 */

import React from "react";
import {
  Home,
  Calculator,
  Grid,
  BookOpen,
  Compass,
  GraduationCap,
  History,
  Heart,
  FolderKanban,
  Binary,
  Atom,
  Cpu,
  Coins,
  Code2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useAppState } from "@/state/useAppState";

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setActiveCalculatorId, history, favorites } = useAppState();

  const navItems = [
    { id: "home", label: "Home Hub", icon: Home },
    { id: "calculator", label: "Standard Calculator", icon: Calculator },
    { id: "calculators-hub", label: "All Calculators", icon: Grid },
    { id: "knowledge-hub", label: "Formulas & Concepts", icon: BookOpen },
    { id: "rule-finder", label: "Rule Finder", icon: Compass },
    { id: "practice", label: "Practice & Master", icon: GraduationCap },
  ];

  const domainShortcuts = [
    { id: "gcd", name: "GCD / Euclidean", domain: "math", icon: Binary },
    { id: "quadratic", name: "Quadratic Solver", domain: "math", icon: Sparkles },
    { id: "force-newton", name: "Force (F = ma)", domain: "science", icon: Atom },
    { id: "ohms-law", name: "Ohm's Law (V=IR)", domain: "science", icon: Cpu },
    { id: "loan-emi", name: "Loan EMI Calculator", domain: "finance", icon: Coins },
    { id: "ipv4-subnet", name: "IPv4 CIDR Subnet", domain: "programming", icon: Code2 },
    { id: "unit-converter", name: "Unit Converter", domain: "converters", icon: RefreshCw },
  ];

  const handleShortcut = (calcId: string) => {
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  return (
    <aside className="w-64 shrink-0 bg-white/[0.02] backdrop-blur-3xl border-r border-white/10 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Primary Navigation */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-3 mb-2">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.06] backdrop-blur-md"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Domain Tools */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-3 mb-2">
            Featured Toolkits
          </div>
          {domainShortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.id}
                onClick={() => handleShortcut(sc.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate">{sc.name}</span>
              </button>
            );
          })}
        </div>

        {/* Personal Records */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-3 mb-2">
            My Workspace
          </div>
          <button
            onClick={() => setActiveView("history")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
              activeView === "history"
                ? "bg-white/10 text-white border border-white/15 backdrop-blur-md shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4" />
              <span>History</span>
            </div>
            {history.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-mono border border-white/10">
                {history.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("favorites")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
              activeView === "favorites"
                ? "bg-white/10 text-white border border-white/15 backdrop-blur-md shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
            </div>
            {favorites.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("workspaces")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
              activeView === "workspaces"
                ? "bg-white/10 text-white border border-white/15 backdrop-blur-md shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Saved Projects</span>
          </button>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-white/10 text-[11px] text-white/40">
        <div>CalcRick Platform v2.0</div>
        <div className="text-[10px] text-white/30 mt-0.5">By Rick Samanta</div>
      </div>
    </aside>
  );
};
