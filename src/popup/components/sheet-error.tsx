import { DialogHeader } from "@/common/ui/dialog";
import { MotionSlideIn } from "@/common/ui/motion";
import Text from "@/common/ui/text";

export default function SheetError({ error }: { error: string }) {
  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <DialogHeader title="Error" />
      <Text>{error}</Text>
    </MotionSlideIn>
  )
}
