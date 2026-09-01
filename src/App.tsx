/**
 * CalcRick - Main Application Root
 * High-precision multi-domain calculation, conversion, verification, and learning platform
 */

import React from "react";
import { AppStateProvider, useAppState } from "@/state/useAppState";
import { Header } from "@/components/shell/Header";
import { Sidebar } from "@/components/shell/Sidebar";
import { BottomNav } from "@/components/shell/BottomNav";
import { SearchModal, SettingsModal, AboutModal } from "@/components/shell/Modals";

// Views
import { HomeView } from "@/views/HomeView";
import { CalculatorsHubView } from "@/views/CalculatorsHubView";
import { KnowledgeHubView } from "@/views/KnowledgeHubView";
import { KnowledgeDetailView } from "@/views/KnowledgeDetailView";
import { RuleFinderView } from "@/views/RuleFinderView";
import { PracticeView } from "@/views/PracticeView";
import { HistoryView, FavoritesView, WorkspacesView } from "@/views/UserWorkspaceViews";

// Calculators
import { StandardCalculator } from "@/components/calculators/StandardCalculator";
import { CalculatorRunner } from "@/components/calculators/CalculatorRunner";
import { getCalculatorById } from "@/engine/registry";

const AppContent: React.FC = () => {
  const { activeView, activeCalculatorId, setActiveCalculatorId, setActiveKnowledgeId, setActiveView } = useAppState();

  const handleExploreConcept = (conceptId: string) => {
    setActiveKnowledgeId(conceptId);
    setActiveView("knowledge-detail");
  };

  const handleExploreCalculator = (calcId: string) => {
    setActiveCalculatorId(calcId);
    setActiveView("calculator");
  };

  const renderMainView = () => {
    switch (activeView) {
      case "home":
        return <HomeView />;

      case "calculator":
        if (activeCalculatorId === "standard-calculator") {
          return <StandardCalculator />;
        }
        const calcDef = getCalculatorById(activeCalculatorId);
        if (calcDef) {
          return (
            <CalculatorRunner
              calculator={calcDef}
              onExploreConcept={handleExploreConcept}
              onExploreCalculator={handleExploreCalculator}
            />
          );
        }
        return <StandardCalculator />;

      case "calculators-hub":
        return <CalculatorsHubView />;

      case "knowledge-hub":
        return <KnowledgeHubView />;

      case "knowledge-detail":
        return <KnowledgeDetailView />;

      case "rule-finder":
        return <RuleFinderView />;

      case "practice":
        return <PracticeView />;

      case "history":
        return <HistoryView />;

      case "favorites":
        return <FavoritesView />;

      case "workspaces":
        return <WorkspacesView />;

      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] text-[#F5F5F7] flex flex-col selection:bg-purple-500/30 selection:text-white relative overflow-hidden font-sans">
      {/* Frosted Glass Atmospheric Ambient Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute top-[35%] -right-[10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-purple-950/20 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] left-[5%] w-[35%] h-[35%] bg-indigo-950/15 rounded-full blur-[90px]" />
      </div>

      {/* Top Header */}
      <Header />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 pb-24 md:pb-8 relative">
          {renderMainView()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <BottomNav />

      {/* Shell Modals */}
      <SearchModal />
      <SettingsModal />
      <AboutModal />
    </div>
  );
};

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
