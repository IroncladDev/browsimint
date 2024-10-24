import { styled } from "react-tailwind-variants"

const Button = styled("button", {
  base: `inline-flex gap-2 items-center justify-center basis-0 border-2 rounded-lg outline-none transition-colors`,
  variants: {
    size: {
      default: "text-base px-4 py-1.5",
      small: "text-sm px-2 py-1",
    },
    variant: {
      primary: `
        bg-sky-800/50 text-cyan-400 border-cyan-500/50

        hover:bg-sky-800/75 hover:border-cyan-500/75

        active:bg-sky-800/90 active:border-cyan-500/90
      `,
      secondary: `
        bg-gray-800/50 text-gray-300 border-gray-500/50

        hover:bg-gray-800/75 hover:border-gray-500/75

        active:bg-gray-800/90 active:border-gray-500/90`,
    },
    fullWidth: {
      true: "w-full",
    },
    grow: {
      true: "flex-grow",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
})

export default Button
