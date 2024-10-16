import { FedimintProviderMethods } from "../../providers/fedimint/types";

export default async function handleFedimintMessage<
  T extends keyof FedimintProviderMethods
>(
  method: T,
  params: FedimintProviderMethods[T][0]
): Promise<FedimintProviderMethods[T][1]> {
  switch (method) {
    case "generateEcash":
      return {
        notes: "",
      };
    case "getAuthenticatedMember":
      return {
        id: Math.random().toString().slice(2),
        username: "unknown",
      };
    case "getActiveFederation":
      return {
        id: "412d2a9338ebeee5957382eb06eac07fa5235087b5a7d5d0a6e18c635394e9ed",
        name: "Fedi Internal",
        network: "bitcoin",
      };
    case "getCurrencyCode":
      return "USD";
    case "getLanguageCode":
      return "en";
    case "receiveEcash":
    default:
      return;
  }
}
