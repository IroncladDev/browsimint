import { styled } from "react-tailwind-variants";
import { acceptRequest, denyRequest } from "./send-message";
import { Button } from "../../components/ui/button";
import Flex from "../../components/ui/flex";
import Text from "../../components/ui/text";

export default function Prompt() {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);

  const method = params.get("method");
  const methodParams = params.get("params");
  const mod = params.get("module");

  const parsedParams = methodParams === null ? null : JSON.parse(methodParams);

  if (!["fedimint", "nostr", "webln"].includes(mod ?? "") || method === null)
    return <Container>Error</Container>;

  return (
    <Flex col>
      <Flex justify="between" gap={2} align="center" p={2}>
        <img src="logo.svg" alt="logo" width={32} height={32} />
        <Text size="xl">Fedimint Web</Text>
      </Flex>
      {mod} / {method} / {methodParams}
      <Button
        onClick={() => {
          acceptRequest("fedimint", "generateEcash", {});
        }}
      >
        Click
      </Button>
      <Button
        onClick={() => {
          denyRequest("fedimint", "generateEcash", {});
        }}
        variant="secondary"
      >
        Cancel
      </Button>
    </Flex>
  );
}

const Container = styled("div", {
  base: "flex flex-col items-center justify-center h-screen",
});
