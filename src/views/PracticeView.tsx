/**
 * CalcRick Practice & Quiz Hub
 * Interactive academic problem solver with instant verification, hints & steps
 */

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { PRACTICE_QUESTIONS } from "@/content/knowledgeGraph";
import { useAppState } from "@/state/useAppState";
import { PracticeQuestion } from "@/types";

export const PracticeView: React.FC = () => {
  const { setActiveView, setActiveCalculatorId } = useAppState();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const filteredQuestions = PRACTICE_QUESTIONS.filter((q) => {
    return selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
  });

  const currentQ: PracticeQuestion | undefined = filteredQuestions[currentIndex % filteredQuestions.length];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !currentQ) return;

    const numericAns = parseFloat(userAnswer);
    let correct = false;

    if (typeof currentQ.correctAnswer === "number") {
      correct = Math.abs(numericAns - currentQ.correctAnswer) < 0.001;
    } else {
      correct = userAnswer.trim().toLowerCase() === String(currentQ.correctAnswer).toLowerCase();
    }

    setIsCorrect(correct);
    setIsAnswered(true);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    setIsAnswered(false);
    setShowHint(false);
    setUserAnswer("");
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsAnswered(false);
    setShowHint(false);
    setUserAnswer("");
    setScore({ correct: 0, total: 0 });
  };

  const handleLaunchCalc = (calcId: string) => {
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  if (!currentQ) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-[#9A9AA2]">
        <p>No questions found in this category.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 backdrop-blur-md text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Practice & Master
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Academic Problem Practice
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Solve problems and verify your work with detailed solutions and step-by-step reasoning.
          </p>
        </div>

        {/* Score Pill */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Score</div>
            <div className="text-sm font-bold text-white font-mono">
              {score.correct} / {score.total}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Reset Score"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Difficulty:</span>
        {(["all", "easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => {
              setSelectedDifficulty(diff);
              setIsAnswered(false);
              setUserAnswer("");
              setShowHint(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all backdrop-blur-md ${
              selectedDifficulty === diff
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)] border border-purple-400/40"
                : "bg-white/[0.04] text-white/60 hover:text-white border border-white/10"
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 space-y-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
            {currentQ.domain} • {currentQ.topic}
          </span>
          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-lg bg-white/5 text-purple-200 border border-white/10">
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <div className="text-lg md:text-xl font-bold leading-relaxed">{currentQ.question}</div>

        {/* Hint Box */}
        {showHint && currentQ.hints && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1 text-xs backdrop-blur-md">
            <div className="font-bold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Hint:
            </div>
            <ul className="list-disc list-inside space-y-1">
              {currentQ.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Input Form */}
        {!isAnswered ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter numerical or formula answer..."
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 focus:border-purple-400/60 rounded-2xl px-5 py-3.5 text-base font-mono text-white outline-none placeholder-white/30"
              />
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Submit
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-white/50">
              {currentQ.hints && (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                </button>
              )}
            </div>
          </form>
        ) : (
          /* Result Feedback */
          <div className="space-y-6 animate-in fade-in">
            <div
              className={`p-5 rounded-2xl border flex items-start gap-3 backdrop-blur-md ${
                isCorrect
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-base">
                  {isCorrect ? "Correct! Excellent work." : "Incorrect Answer."}
                </div>
                <div className="text-xs text-white/80 mt-1">
                  Correct Answer:{" "}
                  <span className="font-bold font-mono text-white">
                    {String(currentQ.correctAnswer)} {currentQ.unit || ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-[0.2em]">
                Step-by-Step Solution Breakdown
              </div>
              <p className="text-xs text-white/80 leading-relaxed">{currentQ.explanation}</p>
              {currentQ.steps && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {currentQ.steps.map((st, i) => (
                    <div key={i} className="text-xs font-mono text-purple-200 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      {st}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {currentQ.relatedCalculatorId && (
                <button
                  onClick={() => handleLaunchCalc(currentQ.relatedCalculatorId!)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5 backdrop-blur-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>Verify with Calculator</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] ml-auto transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
