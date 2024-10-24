import { storageKeys } from "@common/constants"
import { federationSchema } from "@common/schemas"
import { z } from "zod"

// Storage Key Types
export type StorageKey = (typeof storageKeys)[number]

// Federation item
export type FederationItemSchema = z.infer<typeof federationSchema>
