/**
 * CalcRick Rule Finder Wizard
 * Interactive decision matrix solving: "Which rule, formula, or law do I need?"
 */

import React, { useState } from "react";
import { Compass, Sparkles, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useAppState } from "@/state/useAppState";
import { MathView } from "@/components/common/MathView";

interface RuleRecommendation {
  domain: string;
  targetQuestion: string;
  ruleTitle: string;
  ruleType: string;
  latex: string;
  whyThisRule: string;
  calculatorId: string;
  knowledgeId: string;
}

const RULE_DECISION_MATRIX: RuleRecommendation[] = [
  {
    domain: "Geometry & Trigonometry",
    targetQuestion: "Find the missing hypotenuse or side of a 90° right triangle",
    ruleTitle: "Pythagorean Theorem",
    ruleType: "Theorem",
    latex: "a^2 + b^2 = c^2",
    whyThisRule: "Directly relates perpendicular legs to the hypotenuse in Euclidean 2D space.",
    calculatorId: "pythagorean-solver",
    knowledgeId: "pythagorean-theorem-concept",
  },
  {
    domain: "Algebra & Polynomials",
    targetQuestion: "Solve for x in second-degree quadratic equations (ax² + bx + c = 0)",
    ruleTitle: "Quadratic Formula & Discriminant",
    ruleType: "Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    whyThisRule: "Provides exact real and complex roots for any quadratic equation.",
    calculatorId: "quadratic",
    knowledgeId: "quadratic-formula-concept",
  },
  {
    domain: "Number Theory & Fractions",
    targetQuestion: "Find the greatest factor that divides two numbers without remainder",
    ruleTitle: "Euclidean Algorithm (GCD / HCF)",
    ruleType: "Algorithm / Theorem",
    latex: "\\gcd(a, b) = \\gcd(b, a \\bmod b)",
    whyThisRule: "Reduces problem size logarithmically by Euclidean division remainders.",
    calculatorId: "gcd",
    knowledgeId: "gcd-concept",
  },
  {
    domain: "Physics & Mechanics",
    targetQuestion: "Calculate force required to accelerate a given mass",
    ruleTitle: "Newton's Second Law of Motion",
    ruleType: "Physical Law",
    latex: "F = m \\times a",
    whyThisRule: "Fundamental relationship between net force, inertial mass, and acceleration.",
    calculatorId: "force-newton",
    knowledgeId: "newton-second-law-formula",
  },
  {
    domain: "Electricity & Circuits",
    targetQuestion: "Determine current or voltage across a resistor in a DC circuit",
    ruleTitle: "Ohm's Law",
    ruleType: "Circuit Law",
    latex: "V = I \\times R",
    whyThisRule: "Linear relationship between electric potential, current, and resistance.",
    calculatorId: "ohms-law",
    knowledgeId: "ohms-law-concept",
  },
  {
    domain: "Finance & Loans",
    targetQuestion: "Calculate fixed monthly installment (EMI) for a mortgage or loan",
    ruleTitle: "Standard Equated Monthly Installment Formula",
    ruleType: "Financial Formula",
    latex: "EMI = P \\times r \\times \\frac{(1+r)^n}{(1+r)^n - 1}",
    whyThisRule: "Amortizes principal and compound interest equally over n monthly periods.",
    calculatorId: "loan-emi",
    knowledgeId: "compound-interest-concept",
  },
  {
    domain: "Computer Science & Networks",
    targetQuestion: "Calculate network address, broadcast address, and host capacity from CIDR",
    ruleTitle: "IPv4 Binary Bitmask Subnetting",
    ruleType: "CS Rule",
    latex: "\\text{Usable Hosts} = 2^{32 - \\text{CIDR}} - 2",
    whyThisRule: "Divides 32-bit IP addresses into network prefix and host address space.",
    calculatorId: "ipv4-subnet",
    knowledgeId: "ipv4-subnet-concept",
  },
];

export const RuleFinderView: React.FC = () => {
  const { setActiveView, setActiveCalculatorId, setActiveKnowledgeId } = useAppState();
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedTarget, setSelectedTarget] = useState<string>("");

  const domains = Array.from(new Set(RULE_DECISION_MATRIX.map((r) => r.domain)));

  const filteredTargets = selectedDomain
    ? RULE_DECISION_MATRIX.filter((r) => r.domain === selectedDomain)
    : [];

  const matchedRecommendation = RULE_DECISION_MATRIX.find(
    (r) => r.domain === selectedDomain && r.targetQuestion === selectedTarget
  );

  const handleLaunchCalc = (calcId: string) => {
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  const handleLaunchKnowledge = (kId: string) => {
    setActiveKnowledgeId(kId);
    setActiveView("knowledge-detail");
  };

  const handleReset = () => {
    setSelectedDomain("");
    setSelectedTarget("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 backdrop-blur-md text-xs font-semibold uppercase tracking-[0.2em] mb-3">
          <Compass className="w-3.5 h-3.5" /> Decision Matrix
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Rule & Formula Finder
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Answer two quick questions about your problem to discover the exact mathematical theorem, physical law, or financial formula to apply.
        </p>
      </div>

      {/* Step 1: Select Subject Domain */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xs font-mono">
              1
            </span>
            Choose Problem Domain
          </h3>
          {selectedDomain && (
            <button
              onClick={handleReset}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                setSelectedTarget("");
              }}
              className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all backdrop-blur-md ${
                selectedDomain === dom
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400/40 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  : "bg-white/[0.04] text-white/80 hover:text-white border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: What are you solving for? */}
      {selectedDomain && (
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 space-y-4 shadow-2xl animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xs font-mono">
              2
            </span>
            What are you trying to calculate or determine?
          </h3>

          <div className="space-y-2.5">
            {filteredTargets.map((rec) => (
              <button
                key={rec.targetQuestion}
                onClick={() => setSelectedTarget(rec.targetQuestion)}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between backdrop-blur-md ${
                  selectedTarget === rec.targetQuestion
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400/40 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : "bg-white/[0.04] text-white/80 hover:text-white border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                <span>{rec.targetQuestion}</span>
                <ArrowRight className="w-4 h-4 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation Card Output */}
      {matchedRecommendation && (
        <div className="bg-gradient-to-br from-purple-950/40 via-white/[0.03] to-[#0a0510]/80 backdrop-blur-3xl border-2 border-purple-400/40 rounded-[36px] p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-300" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                Recommended {matchedRecommendation.ruleType}
              </span>
            </div>
            <span className="text-xs text-white/40">{matchedRecommendation.domain}</span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {matchedRecommendation.ruleTitle}
            </h2>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              {matchedRecommendation.whyThisRule}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-[0.2em]">Formula</div>
            <MathView latex={matchedRecommendation.latex} className="text-xl text-purple-200" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleLaunchCalc(matchedRecommendation.calculatorId)}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Pre-Configured Calculator</span>
            </button>

            <button
              onClick={() => handleLaunchKnowledge(matchedRecommendation.knowledgeId)}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs transition-all backdrop-blur-md"
            >
              Read Theory & Derivations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
