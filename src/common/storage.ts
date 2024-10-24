import { JSONValue } from "@fedimint/core-web"
import browser from "webextension-polyfill"
import { z } from "zod"

export class LocalStore {
  // Get list of joined federations
  static async getFederations(): Promise<Array<FederationItemSchema>> {
    const federations =
      await LocalStore.getKey<Array<FederationItemSchema>>("federations")

    if (Array.isArray(federations)) {
      return federations.filter(f => federationSchema.safeParse(f).success)
    }

    return []
  }

  // Get the active federation
  static async getActiveFederation(): Promise<FederationItemSchema | null> {
    const activeFederation = await LocalStore.getKey<string>("activeFederation")
    const federations = await LocalStore.getFederations()

    if (activeFederation) {
      return federations.find(x => x.id === activeFederation) ?? null
    }

    return null
  }

  static async getNsec(): Promise<string | null> {
    return (await LocalStore.getKey<string>("nsec")) ?? null
  }

  static async joinFederations(
    federation: FederationItemSchema | Array<FederationItemSchema>,
  ): Promise<void> {
    if (Array.isArray(federation)) {
      const federations = federation.filter(
        f => federationSchema.safeParse(f).success,
      )

      await LocalStore.setKey<Array<FederationItemSchema>>(
        "federations",
        prev => [...(prev ?? []), ...federations],
      )
    } else {
      const parsedFederation = federationSchema.parse(federation)

      await LocalStore.setKey<Array<FederationItemSchema>>(
        "federations",
        prev => [...(prev ?? []), parsedFederation],
      )
    }
  }

  static async removeJoinedFederation(id: string) {
    await LocalStore.setKey<Array<FederationItemSchema>>("federations", prev =>
      (prev ?? []).filter(x => x.id !== id),
    )
  }

  static async getKey<T>(key: StorageKey) {
    return (await browser.storage.local.get([key]))[key] as T | undefined
  }

  static async setKey<T>(
    key: StorageKey,
    setter: JSONValue | ((prev: T | undefined) => JSONValue),
  ) {
    if (typeof setter === "function") {
      const prev = (await browser.storage.local.get([key]))[key]

      await browser.storage.local.set({ [key]: setter(prev) })
    } else {
      await browser.storage.local.set({ [key]: setter })
    }
  }
}

export type StorageKey = "federations" | "activeFederation" | "nsec"

export const federationSchema = z.object({
  name: z.string(),
  id: z.string(),
  icon: z.string().url(),
  network: z.enum(["signet", "bitcoin"]),
  invite: z.string(),
})

export type FederationItemSchema = z.infer<typeof federationSchema>
