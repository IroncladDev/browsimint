export type WindowModuleKind = "fedimint" | "nostr" | "webln";

export interface PromptMessage {
  type: "prompt";
  ext: "fedimint-web";
  prompt: true;
  accept: boolean;
  params?: any;
}

export interface ModuleMethodCall {
  type: "methodCall";
  id?: string;
  ext: "fedimint-web";
  module: WindowModuleKind;
  method: string;
  params: any;
  window: [number, number];
}

export interface InternalCall {
  type: "internalCall";
  ext: "fedimint-web";
  method: string;
  params: any;
}

export type WindowMessage = ModuleMethodCall | PromptMessage | InternalCall;

export enum PermissionLevel {
  None = 0,
  Signature = 1,
  Payment = 2,
}
