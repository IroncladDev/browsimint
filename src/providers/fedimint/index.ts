import { FedimintProviderMethods } from "./types";
import { postMessage } from "../postMessage";
import {
  Duration,
  JSONObject,
  JSONValue,
  MintSpendNotesResponse,
} from "@fedimint/core-web";

export default class FedimintProvider {
  async getConfig(): Promise<JSONValue> {
    return await this.call("getConfig", {});
  }

  async getFederationId(): Promise<string> {
    return await this.call("getFederationId", {});
  }

  async getInviteCode(peer?: number): Promise<string | null> {
    return await this.call("getInviteCode", { peer });
  }

  async redeemEcash(notes: string): Promise<void> {
    await this.call("redeemEcash", { notes });
  }

  async reissueExternalNotes(
    oobNotes: string,
    extraMeta: JSONObject = {}
  ): Promise<string> {
    return await this.call("reissueExternalNotes", {
      oobNotes,
      extraMeta,
    });
  }

  async spendNotes(
    minAmount: number,
    tryCancelAfter: number | Duration = 0,
    includeInvite: boolean = false,
    extraMeta: JSONValue = {}
  ): Promise<MintSpendNotesResponse> {
    return await this.call("spendNotes", {
      minAmount,
      includeInvite,
      extraMeta,
      tryCancelAfter,
    });
  }

  async parseNotes(oobNotes: string): Promise<number> {
    return await this.call("parseNotes", { oobNotes });
  }

  call<T extends keyof FedimintProviderMethods>(
    type: T,
    params: FedimintProviderMethods[T][0]
  ): Promise<FedimintProviderMethods[T][1]> {
    return postMessage(type, params, "fedimint");
  }
}
