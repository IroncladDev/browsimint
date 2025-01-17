import { DialogHeader } from "@/common/ui/dialog"
import { MotionSlideIn } from "@/common/ui/motion"
import { QrCode } from "@/common/ui/qr"
import Button from "@common/ui/button"
import { useToast } from "@common/ui/use-toast"
import { MintSpendNotesResponse } from "@fedimint/core-web"
import { styled } from "react-tailwind-variants"

export default function DisplayNotes({ notes, onComplete }: { notes: MintSpendNotesResponse, onComplete: () => void }) {
  const { toast } = useToast()

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <DialogHeader title="Ecash Notes" />
      <QRContainer>
        <QrCode value={notes.notes} />
      </QRContainer>
      <Button
        onClick={() =>
          navigator.clipboard
            .writeText(notes.notes)
            .then(() => toast({ title: "Invoice Copied to clipboard" }))
        }
      >
        Copy to Clipboard
      </Button>
      <Button onClick={onComplete}>Done</Button>
    </MotionSlideIn>
  )
}

const QRContainer = styled("div", {
  base: "flex align-center justify-center p-4 border-2 rounded-lg border-gray-500/50",
})
