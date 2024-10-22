import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import browser from "webextension-polyfill";
import { FederationItemSchema, LocalStore, StorageKey } from "../lib/storage";

interface AppState {
  federations: Array<FederationItemSchema>;
  activeFederation: FederationItemSchema | null;
  nostrSecretKey: string | null;
  onboardingStep: number;
  setOnboardingStep: Dispatch<SetStateAction<number>>;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [federations, setFederations] = useState<Array<FederationItemSchema>>(
    []
  );
  const [activeFederation, setActiveFederation] =
    useState<FederationItemSchema | null>(null);
  const [nostrSecretKey, setNostrSecretKey] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const federations = await LocalStore.getFederations()
      const activeFederation = await LocalStore.getActiveFederation()
      const nsec = await LocalStore.getNsec()

      console.log(federations, activeFederation, nsec, "INITIAL STATE");

      setFederations(federations as Array<FederationItemSchema>);
      setActiveFederation(activeFederation as FederationItemSchema);
      setNostrSecretKey(nsec as string);
    })();
  }, []);

  useEffect(() => {
    const listener = async (changes: any) => {
      console.log(changes, "STORAGE CHANGES");

      for (const item in changes) {
        switch (item as StorageKey) {
          case "federations":
            setFederations(await LocalStore.getFederations());
            break;
          case "activeFederation":
            setActiveFederation(await LocalStore.getActiveFederation());
            break;
          case "nsec":
            setNostrSecretKey(await LocalStore.getNsec());
            break;
        }
      }
    };

    browser.storage.local.onChanged.addListener(listener);

    return () => {
      browser.storage.local.onChanged.removeListener(listener);
    };
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        federations,
        activeFederation,
        nostrSecretKey,
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
