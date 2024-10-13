import { styled } from "react-tailwind-variants";

export const Input = styled("input", {
  base: "rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus:border-cyan-600 outline-none w-full placeholder:text-gray-500 bg-gray-900 text-white border-2 border-gray-700 h-10 px-4 py-2",
})
