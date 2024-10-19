import { PromptMessage } from "../prompt/send-message";
import { ModuleKind } from "../types";
import FedimintProvider from "./fedimint";
import { FedimintProviderMethods } from "./fedimint/types";
import NostrProvider from "./nostr";
import { NostrProviderMethods } from "./nostr/types";
import WeblnProvider from "./webln";
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

export interface ModuleMethodCall {
  type: "methodCall"
  id?: string;
  ext: "fedimint-web";
  module: ModuleType;
  method: string;
  params: any;
  window: [number, number];
}

export interface RpcCall {
  type: "rpc"
  ext: "fedimint-web"
  module: ModuleKind;
  method: string;
  body: any
  requestId: number
}

export interface UnsubscribeCall {
  type: "unsubscribe"
  requestId: number
}

export type WindowMessage = ModuleMethodCall | PromptMessage | RpcCall | UnsubscribeCall;

declare global {
  interface Window {
    fedimint: FedimintProvider;
    nostr: any;
    webln: any;
  }
}

let fedimint = new FedimintProvider();

window.fedimint = fedimint;
window.nostr = new NostrProvider();
window.webln = new WeblnProvider();
