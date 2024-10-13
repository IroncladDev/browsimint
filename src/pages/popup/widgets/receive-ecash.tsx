import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import Flex from "../../../components/ui/flex";
import Text from "../../../components/ui/text";

export default function ReceiveEcash() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button small fullWidth variant="secondary" grow>
          Receive
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} p={2}>
          <Text>Redeem Ecash Notes</Text>
          <Button onClick={() => alert("Not implemented")}>Paste</Button>
        </Flex>
      </SheetContent>
    </Sheet>
  );
}
