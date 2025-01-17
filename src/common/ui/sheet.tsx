import * as SheetPrimitive from "@radix-ui/react-dialog"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = styled(SheetPrimitive.Overlay, {
  base: `fixed inset-0 z-50 bg-sky-950/70 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`,
})

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContentBase>,
  React.ComponentPropsWithoutRef<typeof SheetContentBase>
>(({ children, ...props }, ref) => {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetContentBase ref={ref} {...props}>
        {children}
      </SheetContentBase>
    </SheetPortal>
  )
})
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetContentBase = styled(SheetPrimitive.Content, {
  base: `fixed z-50 flex flex-col gap-4 p-4 overflow-y-auto max-h-[100vh] border-outline-dimmer outline-none inset-x-0 bottom-0 bg-gray-900
      data-[state=open]:animate-in
      data-[state=open]:slide-in-from-bottom
      data-[state=closed]:animate-out
      data-[state=closed]:slide-out-to-bottom
  `,
})

const SheetTitle = styled(SheetPrimitive.Title, {
  base: "text-white text-base font-medium",
})

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
