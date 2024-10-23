import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import * as React from "react";
import { styled } from "react-tailwind-variants";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = styled(ToastPrimitives.Viewport, {
  base: "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
});

const Toast = styled(ToastPrimitives.Root, {
  base: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border-2 p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-y-0 data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  variants: {
    variant: {
      default: "border-sky-500/50 bg-gray-900 text-gray-100",
      destructive:
        "destructive group border-red-500/50 bg-gray-900 text-gray-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const ToastCloseBase = styled(ToastPrimitives.Close, {
  base: "absolute right-2 top-2 rounded-md p-1 text-gray-100/50 opacity-0 transition-opacity hover:text-gray-50 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
});

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastCloseBase>,
  React.ComponentPropsWithoutRef<typeof ToastCloseBase>
>((props, ref) => (
  <ToastCloseBase {...props} ref={ref}>
    <X className="h-4 w-4" />
  </ToastCloseBase>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = styled(ToastPrimitives.Title, {
  base: "text-sm font-semibold"
})

const ToastDescription = styled(ToastPrimitives.Description, {
  base: "text-sm opacity-90"
})

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
};
