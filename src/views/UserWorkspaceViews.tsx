/**
 * CalcRick History, Favorites & Workspaces Views
 * Real client-side persistence and export capabilities
 */

import React, { useState } from "react";
import {
  History,
  Heart,
  FolderKanban,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  Plus,
  FileDown,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useAppState } from "@/state/useAppState";
import { getCalculatorById } from "@/engine/registry";
import { getKnowledgeById } from "@/content/knowledgeGraph";

/* ========================================================================= */
/* HISTORY VIEW                                                              */
/* ========================================================================= */
export const HistoryView: React.FC = () => {
  const { history, deleteHistoryEntry, clearHistory, setActiveCalculatorId, setActiveView } = useAppState();
  const [filterQuery, setFilterQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter((item) => {
    const q = filterQuery.toLowerCase();
    return (
      item.calculatorName.toLowerCase().includes(q) ||
      item.formattedInput.toLowerCase().includes(q) ||
      item.resultString.toLowerCase().includes(q)
    );
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReopen = (calcId: string) => {
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `calcrick_history_${Date.now()}.json`);
    dlAnchor.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Calculation History Tape
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Browse, recalculate, copy, and export your previous sessions.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/80 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all backdrop-blur-md"
            >
              <FileDown className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={clearHistory}
              className="px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-all backdrop-blur-md"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Tape</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-12 text-center text-white/60 shadow-xl">
          <History className="w-10 h-10 mx-auto text-white/30 mb-3" />
          <h3 className="text-base font-bold text-white">No Calculation History Yet</h3>
          <p className="text-xs mt-1">
            Calculations performed in any solver will automatically appear on this tape.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-purple-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                    {item.calculatorName}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs text-white/70 font-mono">{item.formattedInput}</div>
                <div className="text-lg font-bold font-mono text-white">{item.resultString}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(item.id, item.resultString)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                  title="Copy Result"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleReopen(item.calculatorId)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-xs font-semibold text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all"
                  title="Reopen Solver"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reopen</span>
                </button>
                <button
                  onClick={() => deleteHistoryEntry(item.id)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 border border-white/10 transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* FAVORITES VIEW                                                            */
/* ========================================================================= */
export const FavoritesView: React.FC = () => {
  const { favorites, toggleFavorite, setActiveCalculatorId, setActiveKnowledgeId, setActiveView } = useAppState();

  const handleLaunch = (fav: any) => {
    if (fav.targetType === "calculator") {
      setActiveCalculatorId(fav.targetId);
      setActiveView("calculator");
    } else {
      setActiveKnowledgeId(fav.targetId);
      setActiveView("knowledge-detail");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Saved Favorites & Starred Rules
        </h1>
        <p className="text-xs text-white/60 mt-1">
          Quick-access bookmarks for your most used formulas, theorems, and calculators.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-12 text-center text-white/60 shadow-xl">
          <Heart className="w-10 h-10 mx-auto text-white/30 mb-3" />
          <h3 className="text-base font-bold text-white">No Starred Items Yet</h3>
          <p className="text-xs mt-1">
            Click the heart icon on any calculator or formula to save it here for fast access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              onClick={() => handleLaunch(fav)}
              className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 hover:border-purple-400/40 cursor-pointer transition-all flex items-center justify-between group shadow-xl"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  {fav.targetType} • {fav.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-purple-200 transition-colors">
                  {fav.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(fav.targetId, fav.targetType, fav.title, fav.category);
                  }}
                  className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20"
                  title="Remove from favorites"
                >
                  <Heart className="w-4 h-4 fill-rose-400" />
                </button>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* WORKSPACES VIEW                                                           */
/* ========================================================================= */
export const WorkspacesView: React.FC = () => {
  const { workspaces, createWorkspace, deleteWorkspace, setActiveCalculatorId, setActiveView } = useAppState();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createWorkspace(newTitle, newDesc);
    setNewTitle("");
    setNewDesc("");
    setShowCreate(false);
  };

  const handleReopen = (calcId: string) => {
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Academic Project Workspaces
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Organize complex multi-step homework sets, lab experiments, and project calculations.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Workspace</span>
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="p-6 md:p-8 rounded-[32px] bg-white/[0.04] backdrop-blur-3xl border border-white/15 space-y-4 animate-in fade-in shadow-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Create New Project Workspace</h3>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Workspace Title (e.g. Physics Lab 3 - RC Circuits)"
            className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-sm text-white outline-none focus:border-purple-400/60 placeholder-white/30"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Optional Description..."
            className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-sm text-white outline-none focus:border-purple-400/60 placeholder-white/30"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 text-xs text-white/70 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-xs font-bold text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {workspaces.length === 0 ? (
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-12 text-center text-white/60 shadow-xl">
          <FolderKanban className="w-10 h-10 mx-auto text-white/30 mb-3" />
          <h3 className="text-base font-bold text-white">No Saved Workspaces</h3>
          <p className="text-xs mt-1">
            Create a workspace above to collect calculations and notes for coursework or engineering projects.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {workspaces.map((ws) => (
            <div key={ws.id} className="p-6 md:p-8 rounded-[32px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">{ws.title}</h3>
                  {ws.description && <p className="text-xs text-white/60 mt-0.5">{ws.description}</p>}
                </div>
                <button
                  onClick={() => deleteWorkspace(ws.id)}
                  className="p-2.5 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Workspace"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {ws.items.length === 0 ? (
                <div className="text-xs text-white/40 italic py-2">
                  No calculations saved in this workspace yet. Use "Save into Workspace" on any calculator.
                </div>
              ) : (
                <div className="space-y-2">
                  {ws.items.map((item, idx) => {
                    const calc = getCalculatorById(item.calculatorId);
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-purple-300">
                            {calc?.name || item.calculatorId}
                          </div>
                          <div className="font-mono text-sm text-white font-bold mt-0.5">
                            {item.resultSummary}
                          </div>
                          {item.note && <div className="text-[11px] text-white/50 mt-1">Note: {item.note}</div>}
                        </div>
                        <button
                          onClick={() => handleReopen(item.calculatorId)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-sm"
                        >
                          Open
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
