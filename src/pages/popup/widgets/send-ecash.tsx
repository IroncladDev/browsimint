import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import Flex from "../../../components/ui/flex";
import Text from "../../../components/ui/text";
import { Input } from "../../../components/ui/input";

export default function SendEcash() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button small fullWidth variant="secondary" grow>
          Send
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} p={2}>
          <SheetTitle>
            Send Ecash Notes
          </SheetTitle>
          <Flex col gap={1} width="full" grow>
            <Text>Amount (sats)</Text>
            <Input type="number" defaultValue={0} />
          </Flex>
          <Button onClick={() => alert("Not implemented")}>Send</Button>
        </Flex>
      </SheetContent>
    </Sheet>
  );
}
