import { FederationItemSchema, WindowModuleKind } from "@common/types"

// Prompt Window Dimensions
export const promptWidth = 360
export const promptHeight = 400

// Window extension names
export const windowModule = ["fedimint", "nostr", "webln"] as const

// Storage Keys
export const storageKeys = ["federations", "activeFederation", "nsec"] as const

// Permission Levels
export enum PermissionLevel {
  None = 0,
  Signature = 1,
  Payment = 2,
}

// Permission Levels
export const permissions: Record<
  WindowModuleKind,
  { [key: string]: PermissionLevel }
> = {
  fedimint: {
    getConfig: PermissionLevel.None,
    getFederationId: PermissionLevel.None,
    getInviteCode: PermissionLevel.None,
    listOperations: PermissionLevel.None,
    redeemEcash: PermissionLevel.None,
    reissueExternalNotes: PermissionLevel.None,
    spendNotes: PermissionLevel.Payment,
    validateNotes: PermissionLevel.None,
  },
  nostr: {
    getPublicKey: PermissionLevel.None,
    signEvent: PermissionLevel.Signature,
  },
  webln: {
    makeInvoice: PermissionLevel.Payment,
    sendPayment: PermissionLevel.Payment,
    getBalance: PermissionLevel.None,
  },
} as const

// Hardcoded public federations
export const federations: Array<FederationItemSchema> = [
  {
    name: "Fedi Testnet",
    icon: "https://fedi-public-snapshots.s3.amazonaws.com/icons/fedi-testnet.png",
    network: "signet",
    invite:
      "fed11qgqrgvnhwden5te0v9k8q6rp9ekh2arfdeukuet595cr2ttpd3jhq6rzve6zuer9wchxvetyd938gcewvdhk6tcqqysptkuvknc7erjgf4em3zfh90kffqf9srujn6q53d6r056e4apze5cw27h75",
    id: "fedi-testnet",
  },
  {
    name: "Bitcoin Principles",
    icon: "https://fedi-public-snapshots.s3.amazonaws.com/icons/bitcoin-principles.png",
    network: "bitcoin",
    invite:
      "fed11qgqzygrhwden5te0v9cxjtnzd96xxmmfdec8y6twvd5hqmr9wvhxuet59upqzg9jzp5vsn6mzt9ylhun70jy85aa0sn7sepdp4fw5tjdeehah0hfmufvlqem",
    id: "bitcoin-principles",
  },
  {
    name: "E-Cash Club",
    icon: "https://fm.ctrb.io/federation_assets/logo.png",
    network: "bitcoin",
    invite:
      "fed11qgqpv9rhwden5te0vekjucm5wf3zu6t09amhxtcpqys2ajnveq8lc5ct6t25kztgrahdhxjptsmzujhjlc74upqnwqr05ggd78dhm",
    id: "ecash-club",
  },
]

export const EXTENSION_NAME = "browsimint"
