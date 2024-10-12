import { FedimintProviderMethods } from "./types";
import { postMessage } from "../postMessage";

export default class FedimintProvider {
  version: number = 0;

  // 0 = No permission needed
  // 1 = Signature permission needed
  // 2 = Payment permission needed
  static permissions: Record<keyof FedimintProviderMethods, 0 | 1 | 2> = {
    generateEcash: 1,
    receiveEcash: 1,
    getAuthenticatedMember: 0,
    getActiveFederation: 0,
    getCurrencyCode: 0,
    getLanguageCode: 0,
  };

  generateEcash(params: {
    amount?: string | number;
    defaultAmount?: string | number;
    minimumAmount?: string | number;
    maximumAmount?: string | number;
  }) {
    return this.call("generateEcash", params);
  }

  receiveEcash(notes: string) {
    return this.call("receiveEcash", notes);
  }

  getAuthenticatedMember() {
    return this.call("getAuthenticatedMember", {});
  }

  getActiveFederation() {
    return this.call("getActiveFederation", {});
  }

  getCurrencyCode() {
    return this.call("getCurrencyCode", {});
  }

  private call<T extends keyof FedimintProviderMethods>(
    type: T,
    params: FedimintProviderMethods[T][0]
  ): Promise<FedimintProviderMethods[T][1]> {
    return postMessage(type, params, "fedimint");
  }
}
