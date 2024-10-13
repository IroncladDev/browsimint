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
