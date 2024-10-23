import browser from "webextension-polyfill";
import { balanceSubscription, setUnsubscribeBalance, wallet } from "./state";
import { handleStorageChange } from "./listeners/storage";
import { handleMessage } from "./listeners/message";
import { LocalStore } from "../lib/storage";
import { BalanceUpdate } from "../types";

export const initWallet = async () => {
  const activeFederation = await LocalStore.getActiveFederation();

  if (activeFederation && !wallet.isOpen()) {
    balanceSubscription();
    await wallet.open(activeFederation.id);
    setUnsubscribeBalance(
      wallet.balance.subscribeBalance(async (balance) => {
        browser.runtime
          .sendMessage({
            ext: "fedimint-web",
            type: "balance",
            balance,
          } as BalanceUpdate)
          .catch(() => {});
      })
    );
  }
};

initWallet();

wallet.setLogLevel("debug");

browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    browser.action.openPopup();
  }
});

browser.storage.onChanged.addListener(handleStorageChange);
browser.runtime.onMessage.addListener(handleMessage);
browser.runtime.onMessageExternal.addListener(handleMessage);
