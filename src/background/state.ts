import { Mutex } from "async-mutex";
import { PromptMessage } from "../types";
import { FedimintWallet } from "@fedimint/core-web";

let windowPrompt: {
  resolve: (reason: PromptMessage) => void;
  reject: () => void;
} | null = null;
let promptMutex = new Mutex();
let wallet = new FedimintWallet();
let releasePromptMutex: () => void = () => {};
let unsubscribeBalance: () => void = () => {};

export const setWindowPrompt = (prompt: typeof windowPrompt) =>
  (windowPrompt = prompt);

export const setPromptMutex = (mutex: Mutex) => (promptMutex = mutex);

export const setWallet = (w: FedimintWallet) => (wallet = w);

export const setReleasePromptMutex = (release: () => void) =>
  (releasePromptMutex = release);

export const setUnsubscribeBalance = (subscription: () => void) =>
  (unsubscribeBalance = subscription);

export {
  windowPrompt as openPrompt,
  promptMutex,
  wallet,
  releasePromptMutex,
  unsubscribeBalance as balanceSubscription,
};
