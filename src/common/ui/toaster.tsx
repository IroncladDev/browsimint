"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="up">
      <AnimatePresence mode="wait">
        {toasts.map(({ id, title, ...props }) => (
          <ToastItem key={id} {...props} title={title} />
        ))}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  )
}

function ToastItem({
  title,
  ...props
}: React.ComponentProps<typeof Toast> & { title: React.ReactNode }) {
  return (
    <Toast {...props} asChild>
      <motion.div
        className="grid gap-1"
        initial={{ opacity: 0, translateY: "-100%" }}
        animate={{ opacity: 1, translateY: "0%" }}
        transition={{
          type: "ease-out",
          duration: 0.05,
        }}
        // key={props.key}
      >
        {title && <ToastTitle>{title}</ToastTitle>}
        <ToastClose />
      </motion.div>
    </Toast>
  )
}
