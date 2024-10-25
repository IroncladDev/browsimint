import Flex from "@/common/ui/flex"
import Text from "@/common/ui/text"

export default function KVTable({
  data,
}: {
  data: Record<string, any>
}) {
  return (
    <Flex col className="divide-y divide-gray-600/50 w-full">
      {Object.entries(data).map(([key, value]) => (
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
            {/* TODO: better formatting */}
            {JSON.stringify(value)}
          </Text>
        </Flex>
      ))}
    </Flex>
  )
}
