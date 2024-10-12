import { styled } from "react-tailwind-variants"

const Text = styled("span", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    color: {
      default: "text-foreground",
      dimmer: "text-foreground-dimmer",
      dimmest: "text-foreground-dimmest",
      inherit: "text-inherit",
    },
    weight: {
      default: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    multiline: {
      true: "",
      false: "truncate",
      "clamp-2": "line-clamp-2",
      "clamp-3": "line-clamp-3",
      "clamp-4": "line-clamp-4",
    },
    center: {
      true: "text-center",
    },
    paragraph: {
      true: "max-w-[480px]",
    },
  },
  defaultVariants: {
    color: "default",
    size: "sm",
    weight: "default",
    multiline: false,
    center: false,
  },
})

export default Text
