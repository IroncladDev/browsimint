import { FedimintParams } from "../background/handlers/fedimint";
import { InternalParams } from "../background/handlers/internal";
import { NostrParams } from "../background/handlers/nostr";
import { WeblnParams } from "../background/handlers/webln";

export const windowModule = ["fedimint", "nostr", "webln"] as const;
export type WindowModuleKind = (typeof windowModule)[number];

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
  id: string;
  type: "methodCall";
  ext: "fedimint-web";
  module: WindowModuleKind;
  method: string;
  params: any;
  window: [number, number];
}

export type InternalCall = {
  type: "internalCall";
  ext: "fedimint-web";
} & InternalParams;

export type BalanceUpdate = {
  type: "balance";
  ext: "fedimint-web";
  balance: number;
}

export type BalanceRequest = {
  type: "balanceRequest";
  ext: "fedimint-web";
}

export type WindowMessage = ModuleMethodCall | PromptMessage | InternalCall | BalanceUpdate | BalanceRequest;

export enum PermissionLevel {
  None = 0,
  Signature = 1,
  Payment = 2,
}
