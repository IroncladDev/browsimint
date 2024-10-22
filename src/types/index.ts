import { FedimintParams } from "../background/handlers/fedimint";
import { NostrParams } from "../background/handlers/nostr";
import { WeblnParams } from "../background/handlers/webln";

export type WindowModuleKind = "fedimint" | "nostr" | "webln";

export type MethodParams = WeblnParams | NostrParams | FedimintParams;

export type PromptMessageRejected<T extends MethodParams = MethodParams> =
  | {
      type: "prompt";
      ext: "fedimint-web";
      prompt: true;
      accept: false;
    } & Pick<T, "method">;
export type PromptMessageAccepted<T extends MethodParams = MethodParams> =
  | {
      type: "prompt";
      ext: "fedimint-web";
      prompt: true;
      accept: true;
    } & T;

export type PromptMessage<T extends MethodParams = MethodParams> =
  | PromptMessageRejected<T>
  | PromptMessageAccepted<T>;

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
