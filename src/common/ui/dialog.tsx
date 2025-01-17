import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogClose = DialogPrimitive.Close

const DialogPortal = DialogPrimitive.Portal

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContentBase>,
  React.ComponentPropsWithoutRef<typeof DialogContentBase>
>(({ children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogContentBase ref={ref} {...props}>
        {children}
      </DialogContentBase>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogContentBase = styled(DialogPrimitive.Content, {
  base: `fixed z-50 flex flex-col gap-4 p-4 overflow-y-auto inset-0 bg-gray-900`,
})

const DialogTitle = styled(DialogPrimitive.Title, {
  base: "text-white text-base font-medium",
})

import Flex from "@/common/ui/flex"
import { SheetClose, SheetTitle } from "@/common/ui/sheet"
import { XIcon } from "lucide-react"

function DialogHeader({ title }: { title: string }) {
  return (
    <Flex gap={2} align="center" justify="between">
      <SheetTitle>{title}</SheetTitle>
      <SheetClose>
        <XIcon className="w-5 h-5 text-gray-500" />
      </SheetClose>
    </Flex>
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogHeader
}
