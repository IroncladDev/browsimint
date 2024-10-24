import { Duration, FedimintWallet, JSONObject } from "@fedimint/core-web"

export type FedimintParams =
  | {
      method: "getConfig"
      params: undefined
    }
  | {
      method: "getFederationId"
      params: undefined
    }
  | {
      method: "getInviteCode"
      params: { peer?: number }
    }
  | {
      method: "listOperations"
      params: undefined
    }
  | {
      method: "redeemEcash"
      params: { notes: string }
    }
  | {
      method: "reissueExternalNotes"
      params: { oobNotes: string; extraMeta?: JSONObject }
    }
  | {
      method: "spendNotes"
      params: {
        minAmount: number
        tryCancelAfter: number | Duration
        includeInvite: boolean
        extraMeta?: JSONObject
      }
    }
  | {
      method: "parseNotes"
      params: { oobNotes: string }
    }

export default async function handleFedimintMessage(
  { method, params }: FedimintParams,
  wallet: FedimintWallet,
) {
  switch (method) {
    case "getConfig":
      return await wallet.federation.getConfig()
    case "getFederationId":
      return await wallet.federation.getFederationId()
    case "getInviteCode":
      return await wallet.federation.getInviteCode(params.peer ?? 0)
    case "listOperations":
      return await wallet.federation.listOperations()
    case "redeemEcash":
      return await wallet.mint.redeemEcash(params.notes)
    case "reissueExternalNotes":
      return await wallet.mint.reissueExternalNotes(
        params.oobNotes,
        params.extraMeta,
      )
    case "spendNotes":
      return await wallet.mint.spendNotes(
        params.minAmount,
        params.tryCancelAfter,
        params.includeInvite,
        params.extraMeta,
      )
    case "parseNotes":
      return await wallet.mint.parseNotes(params.oobNotes)
  }
}
