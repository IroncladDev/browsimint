import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import Flex from "../../../components/ui/flex";
import Text from "../../../components/ui/text";

export default function SendLN() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button small fullWidth variant="secondary" grow>
          Pay
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} p={2}>
          <Text>Pay Lightning Invoice</Text>
          <Button onClick={() => alert("Not implemented")}>Paste</Button>
        </Flex>
      </SheetContent>
    </Sheet>
  );
}
