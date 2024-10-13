import { styled } from "react-tailwind-variants";

export const Button = styled("button", {
  base: "border-2 rounded-lg px-4 py-1.5 outline-none basis-0 text-base transition-colors",
  variants: {
    small: {
      true: "px-2 py-1",
    },
    variant: {
      primary:
        "bg-sky-900 text-cyan-500 border-cyan-700 hover:bg-sky-800 hover:border-cyan-600 active:bg-sky-700 active:border-cyan-500",
      secondary:
        "bg-gray-900 text-gray-400 border-gray-600 hover:bg-gray-800 hover:border-gray-500 active:bg-gray-800 active:border-gray-400",
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
  },
});
