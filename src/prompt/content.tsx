import { Button } from "@/components/ui/button"
import Flex from "@/components/ui/flex"
import { Input } from "@/components/ui/input"
import Text from "@/components/ui/text"
import { windowModule } from "@/lib/constants"
import gr from "@/lib/gradients"
import { sendExtensionMessage } from "@/lib/messaging/extension"
import { WindowModuleKind } from "@/types"
import { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import colors from "tailwindcss/colors"
import browser from "webextension-polyfill"

const titleKeys: Record<WindowModuleKind, { [key: string]: string }> = {
  fedimint: {
    spendNotes: "Spend Ecash",
  },
  nostr: {
    signEvent: "Sign Event",
  },
  webln: {
    makeInvoice: "Create Invoice",
    sendPayment: "Send Payment",
  },
} as const

export default function Prompt() {
  const [amount, setAmount] = useState<number>(0)
  const [description, setDescription] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const url = new URL(window.location.href)

  const params = new URLSearchParams(url.search)

  const method = params.get("method")
  const methodParams = params.get("params")
  const mod = params.get("module") as WindowModuleKind | null

  const parsedParams = methodParams === null ? null : JSON.parse(methodParams)

  if (!windowModule.includes((mod ?? "") as any) || method === null)
    return <Container>Error</Container>

  const titleModule = titleKeys[mod as WindowModuleKind]

  let contentComponent: React.ReactNode = null

  useEffect(() => {
    if (mod === "webln" && method === "makeInvoice") {
      const args = parsedParams as {
        amount?: string | number
        defaultAmount?: string | number
        minimumAmount?: string | number
        maximumAmount?: string | number
      }

      setAmount(
        Number(args?.amount || args?.defaultAmount || args?.minimumAmount || 0),
      )
    }
  }, [mod, method, parsedParams])

  if (mod === "fedimint") {
    if (method === "generateEcash") {
      contentComponent = (
        <Flex col className="divide-y divide-gray-600/50 w-full">
          {Object.entries(parsedParams as any).map(([key, value]) => (
            <Flex
              key={key}
              gap={4}
              justify="between"
              align="start"
              className="py-1"
            >
              <Text
                size="sm"
                weight="medium"
                className="text-gray-300 whitespace-nowrap shrink-0"
              >
                {key}
              </Text>
              <Text size="sm" className="text-gray-400 break-all" multiline>
                {JSON.stringify(value)}
              </Text>
            </Flex>
          ))}
        </Flex>
      )
    } else if (method === "receiveEcash") {
      contentComponent = (
        <Text size="sm" className="text-gray-500 break-all w-full" multiline>
          {parsedParams as string}
        </Text>
      )
    }
  } else if (mod === "nostr") {
    if (method === "signEvent") {
      contentComponent = (
        <Flex col className="divide-y divide-gray-600/50 w-full">
          {Object.entries(parsedParams as any).map(([key, value]) => (
            <Flex
              key={key}
              gap={4}
              justify="between"
              align="start"
              className="py-1"
            >
              <Text
                size="sm"
                weight="medium"
                className="text-gray-300 whitespace-nowrap shrink-0"
              >
                {key}
              </Text>
              <Text size="sm" className="text-gray-400 break-all" multiline>
                {JSON.stringify(value)}
              </Text>
            </Flex>
          ))}
        </Flex>
      )
    }
  } else if (mod === "webln") {
    if (method === "makeInvoice") {
      const args = parsedParams as {
        amount?: string | number
        defaultAmount?: string | number
        minimumAmount?: string | number
        maximumAmount?: string | number
        defaultMemo?: string
      }

      contentComponent = (
        <Flex col gap={2} className="w-full">
          <Flex col gap={1}>
            <Text>Amount</Text>
            <Input
              disabled={"amount" in args}
              value={amount}
              min={args?.minimumAmount ? Number(args.minimumAmount) : undefined}
              max={args?.maximumAmount ? Number(args.maximumAmount) : undefined}
              onChange={e => setAmount(Number(e.target.value))}
              type="number"
              inputMode="numeric"
              className="w-full"
            />
          </Flex>
          <Flex col gap={1}>
            <Text>Memo</Text>
            <Input asChild>
              <textarea
                maxLength={255}
                className="resize-y min-h-[60px]"
                placeholder="Memo..."
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </Input>
          </Flex>
        </Flex>
      )
    } else if (method === "sendPayment") {
      contentComponent = (
        <Text size="sm" className="text-gray-500 break-all w-full" multiline>
          {JSON.stringify(parsedParams)}
        </Text>
      )
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
      <Flex
        justify="between"
        gap={2}
        align="center"
        p={2}
        className="border-b border-gray-600"
      >
        <Flex gap={2} align="center">
          <img
            src={browser.runtime.getURL("logo.svg")}
            alt="logo"
            width={32}
            height={32}
          />
          <Text size="xl">Fedimint Web</Text>
        </Flex>
        {/* switcher / nostr icon*/}
      </Flex>

      <Flex col p={4} gap={4} grow>
        <Flex grow col align="center" gap={4}>
          <Text weight="medium" size="lg">
            {titleModule[method as keyof typeof titleModule]}
          </Text>

          {contentComponent}
        </Flex>
        <Flex gap={2} align="center">
          <Button
            onClick={() => {
              sendExtensionMessage({
                type: "prompt",
                accept: false,
                method,
                ext: "fedimint-web",
              })
            }}
            variant="secondary"
            fullWidth
            grow
          >
            Deny
          </Button>
          <Button
            onClick={() => {
              setLoading(true)

              if (mod === "webln" && method === "makeInvoice") {
                sendExtensionMessage({
                  type: "prompt",
                  ext: "fedimint-web",
                  accept: true,
                  method,
                  params: {
                    amount,
                    description,
                  },
                })
              } else {
                sendExtensionMessage({
                  type: "prompt",
                  accept: true,
                  method: method as any,
                  params: parsedParams,
                  ext: "fedimint-web",
                })
              }
            }}
            fullWidth
            grow
            disabled={loading}
          >
            Approve
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

const Container = styled("div", {
  base: "flex flex-col items-center justify-center h-screen",
})
