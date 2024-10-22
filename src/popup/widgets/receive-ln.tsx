import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import Flex from "../../components/ui/flex";
import Text from "../../components/ui/text";
import { Input } from "../../components/ui/input";
import browser from "webextension-polyfill";
import { InternalCall } from "../../types";

export default function ReceiveLN() {
  const test = async () => {
    const args: InternalCall = {
      type: "internalCall",
      ext: "fedimint-web",
      method: "test",
      params: {
        amount: 1000,
      },
    }

    const res = await browser.runtime.sendMessage(args);

    alert(JSON.stringify(res));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button small fullWidth variant="secondary" grow onClick={test}>
          Request
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} p={2}>
          <SheetTitle>
            Request Lightning Payment
          </SheetTitle>
          <Flex col gap={1} width="full" grow>
            <Text>Amount (sats)</Text>
            <Input type="number" defaultValue={0} />
          </Flex>
          <Button onClick={() => alert("Not implemented")}>Request</Button>
        </Flex>
      </SheetContent>
    </Sheet>
  );
}
