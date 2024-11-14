import bolt11 from "bolt11"

export function decodeInvoice(invoice: string) {
  return bolt11.decode(
    invoice,
    invoice.startsWith("lntbs")
      ? {
          bech32: "tbs",
          pubKeyHash: 0x6f,
          scriptHash: 0xc4,
          validWitnessVersions: [0, 1],
        }
      : undefined,
  )
}

export * from "./errors"
