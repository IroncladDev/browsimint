import { WeblnProviderMethods } from "./types";
import { postMessage } from "../postMessage";

export default class WeblnProvider {
  // 0 = No permission needed
  // 1 = Signature permission needed
  // 2 = Payment permission needed
  static permissions: Record<keyof WeblnProviderMethods, 0 | 1 | 2> = {
    enable: 0,
    makeInvoice: 1,
    sendPayment: 2,
  };

  private isEnabled = false;

  async enable() {
    if (this.isEnabled) {
      return;
    }

    this.isEnabled = true;
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
    if (!this.isEnabled) {
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
