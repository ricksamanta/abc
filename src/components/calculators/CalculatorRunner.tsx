/**
 * CalcRick Dynamic Calculator Runner
 * Executes any CalculatorDefinition from the registry with input forms, samples, and results
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Heart,
  RotateCcw,
  Play,
  BookmarkPlus,
  FolderPlus,
  Info,
  Check,
} from "lucide-react";
import { CalculatorDefinition, CalculationResult } from "@/types";
import { CalculationResultCard } from "@/components/common/CalculationResultCard";
import { useAppState } from "@/state/useAppState";

interface CalculatorRunnerProps {
  calculator: CalculatorDefinition;
  initialInputs?: Record<string, any>;
  onExploreConcept?: (conceptId: string) => void;
  onExploreCalculator?: (calcId: string) => void;
}

export const CalculatorRunner: React.FC<CalculatorRunnerProps> = ({
  calculator,
  initialInputs,
  onExploreConcept,
  onExploreCalculator,
}) => {
  const {
    angleUnit,
    precisionMode,
    calculationMode,
    addHistoryEntry,
    isFavorite,
    toggleFavorite,
    workspaces,
    addCalculationToWorkspace,
  } = useAppState();

  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    calculator.inputs?.forEach((inp) => {
      initial[inp.key] = initialInputs?.[inp.key] ?? inp.defaultValue ?? "";
    });
    return initial;
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [workspaceNote, setWorkspaceNote] = useState<string>("");
  const [savedToWsSuccess, setSavedToWsSuccess] = useState(false);

  // Compute on inputs change or initial load
  const runCalculation = (currentInputs: Record<string, any>) => {
    try {
      const calcResult = calculator.calculate(currentInputs, { angleUnit });
      setResult(calcResult);

      if (calcResult.status === "calculated") {
        addHistoryEntry({
          calculatorId: calculator.id,
          calculatorName: calculator.name,
          category: calculator.category,
          rawInput: JSON.stringify(currentInputs),
          formattedInput: calcResult.input || `${calculator.name}`,
          resultString: calcResult.displayResult || String(calcResult.result),
          exactString: calcResult.exactResult,
          mode: calculationMode,
          inputsState: currentInputs,
        });
      }
    } catch (err: any) {
      setResult({
        status: "invalid",
        input: JSON.stringify(currentInputs),
        result: null,
        warnings: [err.message || "An error occurred during calculation."],
      });
    }
  };

  useEffect(() => {
    runCalculation(inputs);
  }, [calculator, angleUnit]);

  const handleInputChange = (key: string, value: any) => {
    const nextInputs = { ...inputs, [key]: value };
    setInputs(nextInputs);
    runCalculation(nextInputs);
  };

  const handleReset = () => {
    const initial: Record<string, any> = {};
    calculator.inputs?.forEach((inp) => {
      initial[inp.key] = inp.defaultValue ?? "";
    });
    setInputs(initial);
    runCalculation(initial);
  };

  const handleSampleClick = (values: Record<string, any>) => {
    setInputs(values);
    runCalculation(values);
  };

  const fav = isFavorite(calculator.id);

  const handleSaveToWorkspace = () => {
    if (!selectedWorkspaceId || !result) return;
    addCalculationToWorkspace(selectedWorkspaceId, {
      calculatorId: calculator.id,
      inputs,
      resultSummary: result.displayResult || String(result.result),
      note: workspaceNote,
    });
    setSavedToWsSuccess(true);
    setTimeout(() => {
      setShowWorkspaceModal(false);
      setSavedToWsSuccess(false);
      setWorkspaceNote("");
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs uppercase font-semibold text-purple-300 tracking-[0.2em]">
              {calculator.domain.toUpperCase()} • {calculator.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              {calculator.name}
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">{calculator.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(calculator.id, "calculator", calculator.name, calculator.category)}
              className={`p-3 rounded-2xl border transition-all ${
                fav
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                  : "bg-white/[0.04] text-white/60 hover:text-white border-white/10 hover:bg-white/[0.08]"
              }`}
              title={fav ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-4 h-4 ${fav ? "fill-rose-400" : ""}`} />
            </button>

            {workspaces.length > 0 && (
              <button
                onClick={() => setShowWorkspaceModal(true)}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/10 transition-all"
                title="Save into Workspace"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/10 transition-all"
              title="Reset Parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Sample Presets */}
        {calculator.sampleInputs && calculator.sampleInputs.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em]">Try Examples:</span>
            {calculator.sampleInputs.map((samp, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(samp.values)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-purple-500/20 hover:text-purple-300 border border-white/10 text-xs font-medium text-white/80 transition-all backdrop-blur-md"
              >
                {samp.label}
              </button>
            ))}
          </div>
        )}

        {/* Inputs Form */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculator.inputs?.map((inp) => (
            <div key={inp.key} className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                {inp.label} {inp.required && <span className="text-purple-400">*</span>}
              </label>

              {inp.type === "select" ? (
                <select
                  value={inputs[inp.key] ?? ""}
                  onChange={(e) => handleInputChange(inp.key, e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-purple-400/60 transition-colors"
                >
                  {inp.options?.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#13131a] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={inp.type === "number" ? "number" : "text"}
                  value={inputs[inp.key] ?? ""}
                  onChange={(e) => handleInputChange(inp.key, inp.type === "number" ? e.target.value : e.target.value)}
                  placeholder={inp.placeholder || "Enter value..."}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white font-mono outline-none focus:border-purple-400/60 transition-colors placeholder-white/20"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Result Presentation */}
      {result && (
        <CalculationResultCard
          result={result}
          title={`${calculator.name} — Result`}
          onExploreConcept={onExploreConcept}
          onExploreCalculator={onExploreCalculator}
        />
      )}

      {/* Workspace Add Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 z-50 bg-[#0a0510]/80 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Save Calculation to Workspace</h3>
            <p className="text-xs text-white/60">
              Group related formulas and calculation steps into your personal project workspace.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em]">Select Workspace</label>
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-sm text-white outline-none focus:border-purple-400/60"
              >
                <option value="" className="bg-[#13131a]">-- Choose Workspace --</option>
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id} className="bg-[#13131a]">
                    {ws.title} ({ws.items.length} items)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em]">Optional Note</label>
              <input
                type="text"
                value={workspaceNote}
                onChange={(e) => setWorkspaceNote(e.target.value)}
                placeholder="e.g., Assignment Problem 4 or Experiment 2 Run"
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-sm text-white outline-none focus:border-purple-400/60"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowWorkspaceModal(false)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 text-sm text-white/70 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToWorkspace}
                disabled={!selectedWorkspaceId}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 disabled:opacity-40 text-sm font-semibold text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
              >
                {savedToWsSuccess ? <Check className="w-4 h-4" /> : "Save to Workspace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
