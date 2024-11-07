import { motion, useSpring } from "framer-motion"
import { forwardRef, useCallback, useEffect, useRef } from "react"

/**
 * Spring-transitions to the height of its children automatically using a ResizeObserver
 */
export const MotionAnimatedHeight = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const height = useSpring(0, { mass: 0.05 })
  const ref = useRef<HTMLDivElement>(null)

  const updateHeight = useCallback(() => {
    if (!ref.current) return

    height.set(ref.current.clientHeight)
  }, [])

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const resizeObserver = new ResizeObserver(updateHeight)

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <motion.div style={{ height }}>
      <div {...props} ref={ref}>
        {children}
      </div>
    </motion.div>
  )
}

/**
 * Slides and fades in from the left on mount, slides and fades out to the right on unmount in an AnimatePresence
 */
export const MotionSlideIn = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof motion.div>
>((props, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, translateX: "-100%" }}
      animate={{ opacity: 1, translateX: "0%" }}
      exit={{
        opacity: 0,
        translateX: "100%",
        position: "absolute",
        width: "100%",
      }}
      transition={{
        type: "spring",
        mass: 0.05,
      }}
      {...props}
    />
  )
})
