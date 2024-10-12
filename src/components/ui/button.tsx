import { styled } from "react-tailwind-variants";

export const Button = styled("button", {
  base: "border-2 rounded-lg px-4 py-1.5 outline-none",
  variants: {
    small: {
      true: "px-2 py-1",
    },
    variant: {
      primary:
        "bg-cyan-950 text-cyan-500 border-cyan-600 hover:bg-cyan-900 hover:border-cyan-500 active:bg-cyan-800 active:border-cyan-400",
      secondary:
        "bg-gray-900 text-gray-500 border-gray-600 hover:bg-gray-800 hover:border-gray-500 active:bg-gray-800 active:border-gray-400",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
