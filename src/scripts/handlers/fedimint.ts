import { FedimintProviderMethods } from "../../providers/fedimint/types";
import { fedimint } from "../background";

export default async function handleFedimintMessage<
  T extends keyof FedimintProviderMethods
>(
  method: T,
  params: FedimintProviderMethods[T][0]
): Promise<FedimintProviderMethods[T][1]> {
  switch (method) {
    case "generateEcash":
      return {
        notes: (await fedimint.mint.spendNotes((params as any).amount)).notes,
      };
    case "getAuthenticatedMember":
      return {
        id: Math.random().toString().slice(2),
        username: "unknown",
      };
    case "getActiveFederation":
      const config = (await fedimint.federation.getConfig()) as any;

      return {
        id: await fedimint.federation.getFederationId(),
        name: config.meta.federation_name,
        // TODO: change
        network: "bitcoin",
      };
    case "getCurrencyCode":
      return "USD";
    case "getLanguageCode":
      return "en";
    case "receiveEcash":
    default:
      return await fedimint.mint.redeemEcash((params as string));
  }
}
