import { MotionSlideIn } from "@/common/ui/motion";
import Text from "@/common/ui/text";
import SheetHeader from "./sheet-header";

export default function SheetError({ error }: { error: string }) {
  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <SheetHeader title="Error" />
      <Text>{error}</Text>
    </MotionSlideIn>
  )
}
