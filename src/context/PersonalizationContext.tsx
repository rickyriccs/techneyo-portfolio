import React, { createContext, useContext, useState, useEffect } from "react";

export type PrimaryGoal = "website" | "mobile_app" | "social_media" | "paid_ads" | "full_stack";
export type BusinessType = "startup" | "ecommerce" | "local_business" | "enterprise" | "agency";
export type TimelineBudget = "urgent" | "standard" | "scale";

export interface UserPreferences {
  primaryGoal: PrimaryGoal | null;
  businessType: BusinessType | null;
  timelineBudget: TimelineBudget | null;
  hasCompletedQuiz: boolean;
}

export interface SelectedAddon {
  id: string;
  name: string;
  price: number;
}

export interface ProposalData {
  serviceTitle: string;
  startingPrice?: number;
  totalPrice?: number;
  selectedAddons?: SelectedAddon[];
  estimatedDays?: string;
  projectedRoi?: string;
}

interface PersonalizationContextType {
  preferences: UserPreferences;
  setPreferences: (data: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isProposalModalOpen: boolean;
  preselectedService: string | null;
  proposalData: ProposalData | null;
  openProposalModal: (data?: string | ProposalData) => void;
  closeProposalModal: () => void;
}

const STORAGE_KEY = "techneyo_user_preferences";

const defaultPreferences: UserPreferences = {
  primaryGoal: null,
  businessType: null,
  timelineBudget: null,
  hasCompletedQuiz: false,
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not parse saved preferences", e);
    }
    return defaultPreferences;
  });

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn("Could not save preferences", e);
    }
  }, [preferences]);

  const setPreferences = (data: Partial<UserPreferences>) => {
    setPreferencesState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetPreferences = () => {
    setPreferencesState(defaultPreferences);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear preferences", e);
    }
  };

  const openProposalModal = (data?: string | ProposalData) => {
    if (typeof data === "string") {
      setPreselectedService(data);
      setProposalData({ serviceTitle: data });
    } else if (data && typeof data === "object") {
      setPreselectedService(data.serviceTitle);
      setProposalData(data);
    } else {
      setPreselectedService(null);
      setProposalData(null);
    }
    setIsProposalModalOpen(true);
  };

  const closeProposalModal = () => {
    setIsProposalModalOpen(false);
    setPreselectedService(null);
    setProposalData(null);
  };

  return (
    <PersonalizationContext.Provider
      value={{
        preferences,
        setPreferences,
        resetPreferences,
        isProposalModalOpen,
        preselectedService,
        proposalData,
        openProposalModal,
        closeProposalModal,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error("usePersonalization must be used within a PersonalizationProvider");
  }
  return context;
};
