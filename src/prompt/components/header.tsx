import Flex from "@common/ui/flex"
import Text from "@common/ui/text"
import browser from "webextension-polyfill"

export default function Header() {
  return (
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
        <Text size="h1" weight="bold" asChild>
          <h1>Browsimint</h1>
        </Text>
      </Flex>
    </Flex>
  )
}
