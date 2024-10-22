import { PermissionLevel, WindowModuleKind } from "../types";

export const permissions: Record<WindowModuleKind, { [key: string]: PermissionLevel }> = {
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
    sendPayment: PermissionLevel.Signature,
    getBalance: PermissionLevel.None,
  },
} as const;

export const federations: Array<{
  name: string;
  icon: string;
  network: "signet" | "bitcoin";
}> = [
  {
    name: "Fedi Testnet",
    icon: "https://fedi-public-snapshots.s3.amazonaws.com/icons/fedi-testnet.png",
    network: "signet",
  },
  {
    name: "Bitcoin Principles",
    icon: "https://fedi-public-snapshots.s3.amazonaws.com/icons/bitcoin-principles.png",
    network: "bitcoin",
  },
  {
    name: "E-Cash Club",
    icon: "https://fm.ctrb.io/federation_assets/logo.png",
    network: "bitcoin",
  },
];
