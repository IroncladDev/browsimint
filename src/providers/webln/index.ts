import { WeblnProviderMethods } from "./types";
import { postMessage } from "../postMessage";

export default class WeblnProvider {
  private hasBeenEnabled = false;

  async enable() {
    if (this.hasBeenEnabled) {
      return;
    }

    this.hasBeenEnabled = true;
  }

  async isEnabled() {
    return this.hasBeenEnabled;
  }

  async getInfo() {
    return {
      methods: [
        "enable",
        "isEnabled",
        "makeInvoice",
        "sendPayment",
        "getBalance",
      ],
    };
  }

  async getBalance() {
    return this.call("getBalance", {});
  }

  async makeInvoice(params: WeblnProviderMethods["makeInvoice"][0]) {
    this.ensureEnabled();

    this.call("makeInvoice", params);
  }

  async sendPayment(params: WeblnProviderMethods["sendPayment"][0]) {
    this.ensureEnabled();

    this.call("sendPayment", params);
  }

  private ensureEnabled() {
    if (!this.hasBeenEnabled) {
      throw new Error("webln is not enabled");
    }
  }

  private call<T extends keyof WeblnProviderMethods>(
    type: T,
    params: WeblnProviderMethods[T][0]
  ): Promise<WeblnProviderMethods[T][1]> {
    return postMessage(type, params, "webln");
  }
}
