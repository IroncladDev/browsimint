import FedimintProvider from "./fedimint";
import { FedimintProviderMethods } from "./fedimint/types";
import { NostrProviderMethods } from "./nostr/types";
import { WeblnProviderMethods } from "./webln/types";

export type ModuleType = "fedimint" | "nostr" | "webln";

export type ProviderMethods = FedimintProviderMethods &
  WeblnProviderMethods &
  NostrProviderMethods;

export type ProviderModuleMethods<T extends ModuleType> = T extends "fedimint"
  ? FedimintProviderMethods
  : T extends "nostr"
  ? NostrProviderMethods
  : T extends "webln"
  ? WeblnProviderMethods
  : never;

export interface WindowMessage {
  id?: string;
  ext: "fedimint-web";
  module: ModuleType;
  method: string;
  params: any;
}

declare global {
  interface Window {
    fedimint: FedimintProvider;
    // fediInternal is an alias for fedimint
    fediInternal: FedimintProvider;
    nostr: any;
    webln: any;
  }
}

let fedimint = new FedimintProvider();

window.fedimint = fedimint;
window.fediInternal = fedimint;
