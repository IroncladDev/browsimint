import { windowModule } from "@common/constants"
import gr from "@common/gradients"
import { WindowModuleKind } from "@common/types"
import Flex from "@common/ui/flex"
import { styled } from "react-tailwind-variants"
import colors from "tailwindcss/colors"
import FedimintSpendNotes from "./components/handlers/fedimint-spend-notes"
import NostrSignEvent from "./components/handlers/nostr-sign-event"
import WeblnMakeInvoice from "./components/handlers/webln-make-invoice"
import WeblnSendPayment from "./components/handlers/webln-send-payment"
import Header from "./components/header"

export default function Prompt() {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  const method = params.get("method")
  const methodParams = params.get("params")
  const mod = params.get("module") as WindowModuleKind | null
  const parsedParams = methodParams === null ? null : JSON.parse(methodParams)

  if (!windowModule.includes((mod ?? "") as any) || method === null)
    return <ErrorContainer>Error</ErrorContainer>

  let content: React.ReactNode | null = null

  if (mod === "fedimint") {
    if (method === "spendNotes") {
      content = <FedimintSpendNotes method={method} params={parsedParams} />
    }
  } else if (mod === "webln") {
    if (method === "makeInvoice") {
      content = <WeblnMakeInvoice method={method} params={parsedParams} />
    } else if (method === "sendPayment") {
      content = <WeblnSendPayment method={method} params={parsedParams} />
    }
  } else if (mod === "nostr") {
    if (method === "signEvent") {
      content = <NostrSignEvent method={method} params={parsedParams} />
    }
  }

  return (
    <Flex
      col
      className="h-screen"
      style={{
        background: gr.merge(
          gr.radial(
            "circle at -10% -10%",
            colors.sky["700"] + "f6",
            colors.sky["800"] + "e8 20%",
            "transparent 60%",
            "transparent",
          ),
        ),
      }}
    >
      <Header />
      {content}
    </Flex>
  )
}

const ErrorContainer = styled("div", {
  base: "flex flex-col items-center justify-center h-screen",
})
