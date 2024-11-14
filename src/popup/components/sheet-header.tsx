import Flex from "@/common/ui/flex";
import { SheetClose, SheetTitle } from "@/common/ui/sheet";
import { XIcon } from "lucide-react";

export default function SheetHeader({ title }: { title: string }) {
  return (
    <Flex gap={2} align="center" justify="between">
      <SheetTitle>{title}</SheetTitle>
      <SheetClose>
        <XIcon className="w-5 h-5 text-gray-500" />
      </SheetClose>
    </Flex>
  )
}
