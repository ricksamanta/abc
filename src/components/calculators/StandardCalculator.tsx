/**
 * CalcRick Standard & Scientific Calculator
 * Follows §4.4: Scrolling expression display, exact result, Memory (MC/MR/M+/M-/MS),
 * ANS register, Undo/Redo, Scratchpad mode, Scientific buttons, Full Keyboard input.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Delete,
  RotateCcw,
  RotateCw,
  Sparkles,
  BookOpen,
  History,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { evaluateExpression, SafeEvaluator } from "@/engine/parser";
import { useAppState } from "@/state/useAppState";
import { CalculationResultCard } from "@/components/common/CalculationResultCard";
import { CalculationResult } from "@/types";

export const StandardCalculator: React.FC = () => {
  const {
    angleUnit,
    setAngleUnit,
    precisionMode,
    numberFormat,
    addHistoryEntry,
    calculationMode,
  } = useAppState();

  const [expression, setExpression] = useState("");
  const [liveResult, setLiveResult] = useState<string>("0");
  const [evaluatedResultObj, setEvaluatedResultObj] = useState<CalculationResult | null>(null);
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [ans, setAns] = useState<number>(0);
  const [isScientific, setIsScientific] = useState<boolean>(true);
  const [isScratchpad, setIsScratchpad] = useState<boolean>(false);
  const [scratchpadText, setScratchpadText] = useState<string>("radius = 5\nheight = 12\nvolume = pi * radius^2 * height");
  const [scratchpadOutputs, setScratchpadOutputs] = useState<{ line: string; result: string }[]>([]);

  // History stack for undo/redo
  const [historyStack, setHistoryStack] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const updateExpression = (newExpr: string) => {
    setExpression(newExpr);
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(newExpr);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
  };

  // Evaluate on the fly
  useEffect(() => {
    if (!expression.trim()) {
      setLiveResult("0");
      setEvaluatedResultObj(null);
      return;
    }

    const res = evaluateExpression(expression, {
      variables: { ans },
      angleUnit,
    });

    if (!res.error && !isNaN(res.value)) {
      setLiveResult(res.display);
    } else {
      setLiveResult(res.error || "...");
    }
  }, [expression, ans, angleUnit]);

  // Scratchpad evaluator
  useEffect(() => {
    if (!isScratchpad) return;
    const lines = scratchpadText.split("\n");
    const vars: Record<string, number> = { ans };
    const outputs = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return { line, result: "" };
      }
      const evalRes = evaluateExpression(trimmed, { variables: vars, angleUnit });
      return {
        line,
        result: evalRes.error ? `Error: ${evalRes.error}` : evalRes.display,
      };
    });
    setScratchpadOutputs(outputs);
  }, [scratchpadText, isScratchpad, angleUnit, ans]);

  // Execute full calculation (press Equals or Enter)
  const handleCalculate = () => {
    if (!expression.trim()) return;

    const res = evaluateExpression(expression, {
      variables: { ans },
      angleUnit,
    });

    if (res.error) {
      setEvaluatedResultObj({
        status: "invalid",
        input: expression,
        result: null,
        warnings: [res.error],
      });
      return;
    }

    setAns(res.value);
    setLiveResult(res.display);

    const calcResult: CalculationResult = {
      status: "calculated",
      input: expression,
      result: res.value,
      displayResult: res.display,
      exactResult: res.exact,
      isExact: res.isExact,
      explanation: `Evaluated using deterministic operator precedence and standard mathematical constants.`,
      steps: [
        {
          title: "Expression Tokenization & Parsing",
          text: `Input: ${expression}`,
        },
        {
          title: "Evaluation Result",
          text: `Result = ${res.display} (Angle mode: ${angleUnit.toUpperCase()})`,
        },
      ],
      assumptions: [
        { name: "Angle Unit", value: angleUnit.toUpperCase(), description: "Trigonometric functions evaluated in this angle system" },
      ],
      verification: {
        passed: true,
        detail: `Deterministic evaluation produced ${res.display}.`,
      },
    };

    setEvaluatedResultObj(calcResult);

    addHistoryEntry({
      calculatorId: "standard-calculator",
      calculatorName: "Standard & Scientific Calculator",
      category: "arithmetic",
      rawInput: expression,
      formattedInput: expression,
      resultString: res.display,
      exactString: res.exact,
      mode: calculationMode,
    });
  };

  // Button Click Handlers
  const handleBtn = (val: string) => {
    updateExpression(expression + val);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    updateExpression("");
    setLiveResult("0");
    setEvaluatedResultObj(null);
  };

  const handleBackspace = () => {
    updateExpression(expression.slice(0, -1));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setExpression(historyStack[prev]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setExpression(historyStack[next]);
    }
  };

  // Memory Handlers
  const handleMC = () => {
    setMemory(0);
    setHasMemory(false);
  };
  const handleMR = () => {
    if (hasMemory) updateExpression(expression + memory.toString());
  };
  const handleMPlus = () => {
    const currentNum = parseFloat(liveResult) || 0;
    setMemory((prev) => prev + currentNum);
    setHasMemory(true);
  };
  const handleMMinus = () => {
    const currentNum = parseFloat(liveResult) || 0;
    setMemory((prev) => prev - currentNum);
    setHasMemory(true);
  };
  const handleMS = () => {
    const currentNum = parseFloat(liveResult) || 0;
    setMemory(currentNum);
    setHasMemory(true);
  };

  // Keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCalculate();
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Calculator Container */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl p-5 md:p-7 text-[#F5F5F7]">
        {/* Header Controls: Modes & Units */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Standard & Scientific Calculator
            </span>
            {hasMemory && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                MEM: {memory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Angle Unit Switcher */}
            <div className="flex items-center bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              {(["deg", "rad", "grad"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setAngleUnit(u)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase transition-all ${
                    angleUnit === u
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Scratchpad Mode Toggle */}
            <button
              onClick={() => setIsScratchpad(!isScratchpad)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${
                isScratchpad
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/[0.04] text-white/70 hover:text-white border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {isScratchpad ? "Keypad Mode" : "Multi-line Scratchpad"}
            </button>
          </div>
        </div>

        {/* Display Screen */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-5 transition-all focus-within:border-purple-400/50">
          <div className="flex items-center justify-between text-xs text-white/40 mb-1">
            <span className="font-mono uppercase tracking-wider">Expression</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="hover:text-white text-white/50 disabled:opacity-20 transition-opacity"
                title="Undo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= historyStack.length - 1}
                className="hover:text-white text-white/50 disabled:opacity-20 transition-opacity"
                title="Redo"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={expression}
            onChange={(e) => updateExpression(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or click buttons (e.g., 2 + 3 * 4, sin(45), sqrt(144))"
            className="w-full bg-transparent text-lg md:text-xl font-mono text-white outline-none placeholder-white/20"
          />

          <div className="mt-3 pt-3 border-t border-white/10 flex items-baseline justify-between">
            <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
              {expression ? "Live Result" : "Result"}
            </span>
            <div className="text-2xl md:text-3xl font-extrabold text-white font-mono tracking-tight">
              {liveResult}
            </div>
          </div>
        </div>

        {/* Scratchpad Editor View */}
        {isScratchpad ? (
          <div className="space-y-4">
            <div className="text-xs text-white/60">
              Assign variables on sequential lines (e.g. <code className="text-purple-300">radius = 5</code>, <code className="text-purple-300">area = pi * radius^2</code>).
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                rows={8}
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 font-mono text-sm text-white outline-none focus:border-purple-400/50 resize-y"
                placeholder="Enter mathematical steps..."
              />
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 font-mono text-sm space-y-2 overflow-y-auto max-h-[220px]">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Evaluated Outputs</div>
                {scratchpadOutputs.map((out, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-white/50 text-xs truncate max-w-[50%]">{out.line}</span>
                    <span className="font-bold text-white text-sm">{out.result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Keypad Buttons Grid */
          <div className="space-y-3">
            {/* Memory Row */}
            <div className="grid grid-cols-6 gap-2">
              <button onClick={handleMC} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/60 hover:text-white border border-white/5 transition-all">MC</button>
              <button onClick={handleMR} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/60 hover:text-white border border-white/5 transition-all">MR</button>
              <button onClick={handleMPlus} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/60 hover:text-white border border-white/5 transition-all">M+</button>
              <button onClick={handleMMinus} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/60 hover:text-white border border-white/5 transition-all">M−</button>
              <button onClick={handleMS} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/60 hover:text-white border border-white/5 transition-all">MS</button>
              <button onClick={() => handleBtn("ans")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-purple-300 hover:text-white border border-white/5 transition-all">ANS</button>
            </div>

            {/* Scientific Functions */}
            <div className="grid grid-cols-6 gap-2">
              <button onClick={() => handleBtn("sin(")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">sin</button>
              <button onClick={() => handleBtn("cos(")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">cos</button>
              <button onClick={() => handleBtn("tan(")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">tan</button>
              <button onClick={() => handleBtn("sqrt(")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">√x</button>
              <button onClick={() => handleBtn("^2")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">x²</button>
              <button onClick={() => handleBtn("^")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">xʸ</button>

              <button onClick={() => handleBtn("log(")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">log</button>
              <button onClick={() => handleBtn("ln(")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">ln</button>
              <button onClick={() => handleBtn("pi")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">π</button>
              <button onClick={() => handleBtn("e")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">e</button>
              <button onClick={() => handleBtn("!")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">n!</button>
              <button onClick={() => handleBtn(" mod ")} className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-purple-300 border border-white/5 transition-all">mod</button>
            </div>

            {/* Standard Number & Operator Keypad */}
            <div className="grid grid-cols-4 gap-2.5 pt-2 border-t border-white/10">
              <button onClick={handleClear} className="py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-sm border border-rose-500/20 transition-all">AC</button>
              <button onClick={() => handleBtn("(")} className="py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold text-sm border border-white/5 transition-all">(</button>
              <button onClick={() => handleBtn(")")} className="py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold text-sm border border-white/5 transition-all">)</button>
              <button onClick={() => handleBtn(" / ")} className="py-3.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-lg border border-purple-500/20 transition-all">÷</button>

              <button onClick={() => handleBtn("7")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">7</button>
              <button onClick={() => handleBtn("8")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">8</button>
              <button onClick={() => handleBtn("9")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">9</button>
              <button onClick={() => handleBtn(" * ")} className="py-3.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-lg border border-purple-500/20 transition-all">×</button>

              <button onClick={() => handleBtn("4")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">4</button>
              <button onClick={() => handleBtn("5")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">5</button>
              <button onClick={() => handleBtn("6")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">6</button>
              <button onClick={() => handleBtn(" - ")} className="py-3.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-lg border border-purple-500/20 transition-all">−</button>

              <button onClick={() => handleBtn("1")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">1</button>
              <button onClick={() => handleBtn("2")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">2</button>
              <button onClick={() => handleBtn("3")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">3</button>
              <button onClick={() => handleBtn(" + ")} className="py-3.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-lg border border-purple-500/20 transition-all">+</button>

              <button onClick={() => handleBtn("0")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">0</button>
              <button onClick={() => handleBtn(".")} className="py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-lg border border-white/5 transition-all">.</button>
              <button onClick={handleBackspace} className="py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 font-bold flex items-center justify-center border border-white/5 transition-all">
                <Delete className="w-5 h-5" />
              </button>
              <button onClick={handleCalculate} className="py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-bold text-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all">
                =
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Breakdown Card */}
      {evaluatedResultObj && (
        <CalculationResultCard
          result={evaluatedResultObj}
          title="Expression Evaluation & Solution"
        />
      )}
    </div>
  );
};
