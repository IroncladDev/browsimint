import { styled } from "react-tailwind-variants"

const Text = styled("span", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      h2: "text-2xl",
      h1: "text-3xl",
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
    color: {
      default: "text-gray-100",
      dimmer: "text-gray-300",
      dimmest: "text-gray-500",
    },
  },
  defaultVariants: {
    color: "default",
    size: "base",
    weight: "default",
    multiline: false,
    center: false,
  },
})

export default Text
