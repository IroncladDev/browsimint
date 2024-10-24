import {
  Duration,
  JSONObject,
  JSONValue,
  MintSpendNotesResponse,
} from "@fedimint/core-web"
import { postMessage } from "../postMessage"

export default class FedimintProvider {
  async getConfig(): Promise<JSONValue> {
    return await postMessage("getConfig", {}, "fedimint")
  }

  async getFederationId(): Promise<string> {
    return await postMessage("getFederationId", {}, "fedimint")
  }

  async getInviteCode(peer?: number): Promise<string | null> {
    return await postMessage("getInviteCode", { peer }, "fedimint")
  }

  async redeemEcash(notes: string): Promise<void> {
    await postMessage("redeemEcash", { notes }, "fedimint")
  }

  async reissueExternalNotes(
    oobNotes: string,
    extraMeta: JSONObject = {},
  ): Promise<string> {
    return await postMessage(
      "reissueExternalNotes",
      {
        oobNotes,
        extraMeta,
      },
      "fedimint",
    )
  }

  async spendNotes(
    minAmount: number,
    tryCancelAfter: number | Duration = 0,
    includeInvite: boolean = false,
    extraMeta: JSONValue = {},
  ): Promise<MintSpendNotesResponse> {
    return await postMessage(
      "spendNotes",
      {
        minAmount,
        includeInvite,
        extraMeta,
        tryCancelAfter,
      },
      "fedimint",
    )
  }

  async parseNotes(oobNotes: string): Promise<number> {
    return await postMessage("parseNotes", { oobNotes }, "fedimint")
  }
}
