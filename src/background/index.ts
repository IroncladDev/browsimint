import { sendExtensionMessage } from "@common/messaging/extension"
import { LocalStore } from "@common/storage"
import browser from "webextension-polyfill"
import { handleMessage } from "./listeners/message"
import { handleStorageChange } from "./listeners/storage"
import { balanceSubscription, setUnsubscribeBalance, wallet } from "./state"

export const initWallet = async () => {
  const activeFederation = await LocalStore.getActiveFederation()

  if (activeFederation && !wallet.isOpen()) {
    balanceSubscription()
    await wallet.open(activeFederation.id)
    setUnsubscribeBalance(
      wallet.balance.subscribeBalance(async balance => {
        sendExtensionMessage({
          type: "balance",
          balance,
        }).catch(() => {})
      }),
    )
  }
}

initWallet()

wallet.setLogLevel("debug")

browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    browser.action.openPopup()
  }
})

browser.storage.onChanged.addListener(handleStorageChange)
browser.runtime.onMessage.addListener(handleMessage)
browser.runtime.onMessageExternal.addListener(handleMessage)
