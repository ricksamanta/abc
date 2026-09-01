/**
 * CalcRick Central State & Persistence Engine
 * Manages guest-first localStorage state, preferences, history, favorites & workspaces
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AngleUnit,
  CalculationMode,
  FavoriteEntry,
  HistoryEntry,
  NumberFormat,
  PrecisionMode,
  ThemeMode,
  WorkspaceItem,
} from "@/types";

export interface AppStateContextType {
  // Appearance & Preferences
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  calculationMode: CalculationMode;
  setCalculationMode: (m: CalculationMode) => void;
  angleUnit: AngleUnit;
  setAngleUnit: (u: AngleUnit) => void;
  precisionMode: PrecisionMode;
  setPrecisionMode: (p: PrecisionMode) => void;
  numberFormat: NumberFormat;
  setNumberFormat: (f: NumberFormat) => void;

  // Navigation & Active View
  activeView:
    | "home"
    | "calculator"
    | "calculators-hub"
    | "knowledge-hub"
    | "knowledge-detail"
    | "rule-finder"
    | "practice"
    | "history"
    | "favorites"
    | "workspaces"
    | "about";
  setActiveView: (view: any) => void;
  activeCalculatorId: string;
  setActiveCalculatorId: (id: string) => void;
  activeKnowledgeId: string;
  setActiveKnowledgeId: (id: string) => void;

  // History
  history: HistoryEntry[];
  addHistoryEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;

  // Favorites
  favorites: FavoriteEntry[];
  toggleFavorite: (targetId: string, type: FavoriteEntry["targetType"], title: string, category: string) => void;
  isFavorite: (targetId: string) => boolean;

  // Workspaces
  workspaces: WorkspaceItem[];
  createWorkspace: (title: string, description?: string) => void;
  deleteWorkspace: (id: string) => void;
  addCalculationToWorkspace: (workspaceId: string, item: { calculatorId: string; inputs: any; resultSummary: string; note?: string }) => void;

  // Global UI Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: "calcrick_theme",
  CALC_MODE: "calcrick_calc_mode",
  ANGLE_UNIT: "calcrick_angle_unit",
  PRECISION: "calcrick_precision",
  NUM_FORMAT: "calcrick_num_format",
  HISTORY: "calcrick_history",
  FAVORITES: "calcrick_favorites",
  WORKSPACES: "calcrick_workspaces",
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Preferences
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode) || "dark";
  });

  const [calculationMode, setCalculationModeState] = useState<CalculationMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CALC_MODE) as CalculationMode) || "learn";
  });

  const [angleUnit, setAngleUnitState] = useState<AngleUnit>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ANGLE_UNIT) as AngleUnit) || "deg";
  });

  const [precisionMode, setPrecisionModeState] = useState<PrecisionMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.PRECISION) as PrecisionMode) || "auto";
  });

  const [numberFormat, setNumberFormatState] = useState<NumberFormat>(() => {
    return (localStorage.getItem(STORAGE_KEYS.NUM_FORMAT) as NumberFormat) || "standard";
  });

  // Navigation State
  const [activeView, setActiveView] = useState<any>("home");
  const [activeCalculatorId, setActiveCalculatorId] = useState<string>("standard-calculator");
  const [activeKnowledgeId, setActiveKnowledgeId] = useState<string>("gcd-concept");

  // History State
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorites State
  const [favorites, setFavorites] = useState<FavoriteEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Workspaces State
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Sync Theme with document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.className = "bg-[#0A0A0C] text-[#F5F5F7] font-['Plus_Jakarta_Sans',sans-serif] antialiased";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      document.body.className = "bg-[#F7F7FA] text-[#16161A] font-['Plus_Jakarta_Sans',sans-serif] antialiased";
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
  };

  const setCalculationMode = (m: CalculationMode) => {
    setCalculationModeState(m);
    localStorage.setItem(STORAGE_KEYS.CALC_MODE, m);
  };

  const setAngleUnit = (u: AngleUnit) => {
    setAngleUnitState(u);
    localStorage.setItem(STORAGE_KEYS.ANGLE_UNIT, u);
  };

  const setPrecisionMode = (p: PrecisionMode) => {
    setPrecisionModeState(p);
    localStorage.setItem(STORAGE_KEYS.PRECISION, p);
  };

  const setNumberFormat = (f: NumberFormat) => {
    setNumberFormatState(f);
    localStorage.setItem(STORAGE_KEYS.NUM_FORMAT, f);
  };

  // History Actions
  const addHistoryEntry = (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: "hist_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const updated = [newEntry, ...prev.slice(0, 99)]; // keep latest 100
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  };

  // Favorites Actions
  const toggleFavorite = (targetId: string, type: FavoriteEntry["targetType"], title: string, category: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.targetId === targetId);
      let updated: FavoriteEntry[];
      if (exists) {
        updated = prev.filter((f) => f.targetId !== targetId);
      } else {
        const newFav: FavoriteEntry = {
          id: "fav_" + Date.now(),
          targetId,
          targetType: type,
          title,
          category,
          savedAt: Date.now(),
        };
        updated = [newFav, ...prev];
      }
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (targetId: string) => {
    return favorites.some((f) => f.targetId === targetId);
  };

  // Workspaces Actions
  const createWorkspace = (title: string, description?: string) => {
    const newWs: WorkspaceItem = {
      id: "ws_" + Date.now(),
      title,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: [],
    };
    setWorkspaces((prev) => {
      const updated = [newWs, ...prev];
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(updated));
      return updated;
    });
  };

  const addCalculationToWorkspace = (workspaceId: string, item: { calculatorId: string; inputs: any; resultSummary: string; note?: string }) => {
    setWorkspaces((prev) => {
      const updated = prev.map((w) => {
        if (w.id !== workspaceId) return w;
        return {
          ...w,
          updatedAt: Date.now(),
          items: [...w.items, item],
        };
      });
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppStateContext.Provider
      value={{
        theme,
        setTheme,
        calculationMode,
        setCalculationMode,
        angleUnit,
        setAngleUnit,
        precisionMode,
        setPrecisionMode,
        numberFormat,
        setNumberFormat,
        activeView,
        setActiveView,
        activeCalculatorId,
        setActiveCalculatorId,
        activeKnowledgeId,
        setActiveKnowledgeId,
        history,
        addHistoryEntry,
        deleteHistoryEntry,
        clearHistory,
        favorites,
        toggleFavorite,
        isFavorite,
        workspaces,
        createWorkspace,
        deleteWorkspace,
        addCalculationToWorkspace,
        isSearchOpen,
        setIsSearchOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isAboutOpen,
        setIsAboutOpen,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
