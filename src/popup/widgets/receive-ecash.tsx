import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import Flex from "../../components/ui/flex";

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
          <SheetTitle>Redeem Ecash Notes</SheetTitle>
          <Button onClick={() => alert("Not implemented")}>Paste</Button>
        </Flex>
      </SheetContent>
    </Sheet>
  );
}
