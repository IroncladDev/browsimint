import { sendExtensionMessage } from "@/common/messaging/extension"
import Button from "@/common/ui/button"
import Flex from "@/common/ui/flex"
import Text from "@/common/ui/text"

export default function ConfirmationBase({
  title,
  children,
  onAccept,
  method,
  loading,
}: {
  method: string
  title: string
  children: React.ReactNode
  onAccept: () => void
  loading?: boolean
}) {
  return (
    <Flex col p={4} gap={4} grow>
      <Flex grow col align="center" gap={4}>
        <Text weight="medium" size="lg">
          {title}
        </Text>

        {children}
      </Flex>
      <Flex gap={2} align="center">
        <Button
          onClick={() => {
            sendExtensionMessage({
              type: "prompt",
              accept: false,
              method,
            })
          }}
          variant="secondary"
          fullWidth
          grow
        >
          Cancel
        </Button>
        <Button
          onClick={onAccept}
          variant="primary"
          fullWidth
          grow
          disabled={loading}
        >
          Proceed
        </Button>
      </Flex>
    </Flex>
  )
}
