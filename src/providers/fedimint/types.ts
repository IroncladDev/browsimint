import {
  Duration,
  JSONObject,
  JSONValue,
  MintSpendNotesResponse,
} from "@fedimint/core-web";

// method: [args, return type]
export type FedimintProviderMethods = {
  getConfig: [{}, JSONValue];
  getFederationId: [{}, string];
  getInviteCode: [{ peer?: number }, string | null];
  listOperations: [{}, Array<JSONValue>];
  redeemEcash: [{ notes: string }, void];
  reissueExternalNotes: [{ oobNotes: string; extraMeta: JSONObject }, string];
  spendNotes: [
    {
      minAmount: number;
      tryCancelAfter: number | Duration;
      includeInvite: boolean;
      extraMeta: JSONValue;
    },
    MintSpendNotesResponse
  ];
  parseNotes: [{ oobNotes: string }, number];
};
