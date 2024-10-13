import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface AppState {
  joinedFederations: Array<string>;
  activeFederation: string | null;
  nostrSecretKey: string | null;
  onboardingStep: number;
  setJoinedFederations: Dispatch<SetStateAction<Array<string>>>;
  setActiveFederation: Dispatch<SetStateAction<string | null>>;
  setNostrSecretKey: Dispatch<SetStateAction<string | null>>;
  setOnboardingStep: Dispatch<SetStateAction<number>>;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [joinedFederations, setJoinedFederations] = useState<Array<string>>([]);
  const [activeFederation, setActiveFederation] = useState<string | null>(null);
  const [nostrSecretKey, setNostrSecretKey] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  return (
    <AppStateContext.Provider
      value={{
        joinedFederations,
        activeFederation,
        setJoinedFederations,
        setActiveFederation,
        nostrSecretKey,
        setNostrSecretKey,
        onboardingStep,
        setOnboardingStep,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const value = useContext(AppStateContext);

  if (!value)
    throw new Error("useAppState must be used within a AppStateProvider");

  return value;
}
