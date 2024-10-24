import { FedimintWallet } from "@fedimint/core-web"
import { Storage } from "webextension-polyfill"
import { sendExtensionMessage } from "../../common/messaging/extension"
import {
  FederationItemSchema,
  federationSchema,
  LocalStore,
} from "../../common/storage"
import {
  balanceSubscription,
  setUnsubscribeBalance,
  setWallet,
  wallet,
} from "../state"

export async function handleStorageChange(
  changes: Record<string, Storage.StorageChange>,
) {
  for (const item in changes) {
    const { oldValue, newValue } = changes[item]

    switch (item) {
      case "activeFederation":
        if (wallet.isOpen()) {
          balanceSubscription()
          await wallet.cleanup()
          setWallet(new FedimintWallet())

          wallet.setLogLevel("debug")

          await wallet.open(newValue)
        } else {
          await wallet.open(newValue)
        }

        setUnsubscribeBalance(
          wallet.balance.subscribeBalance(async balance => {
            sendExtensionMessage({
              ext: "fedimint-web",
              type: "balance",
              balance,
            })
          }),
        )
        break
      case "federations":
        const existingFeds: Array<FederationItemSchema> = oldValue ?? []
        const newFeds: Array<FederationItemSchema> = newValue ?? []

        let newFederations = newFeds

        if (existingFeds.length < newFeds.length) {
          if (existingFeds.length === 0) {
            await LocalStore.setKey("activeFederation", newFeds[0].id)
          }

          newFederations = newFeds.filter(
            (f: FederationItemSchema) =>
              !existingFeds.some((x: FederationItemSchema) => x.id === f.id),
          )
        } else {
          const activeFed = await LocalStore.getActiveFederation()

          if (
            !newFeds.some((x: FederationItemSchema) => x.id === activeFed?.id)
          ) {
            await LocalStore.setKey("activeFederation", newFeds[0].id)
          }
        }

        newFederations = newFederations.filter(
          x => federationSchema.safeParse(x).success,
        )

        await Promise.all(
          newFederations.map(fed => wallet.joinFederation(fed.invite, fed.id)),
        )

        await LocalStore.joinFederations(newFederations)
    }
    break
  }
}
