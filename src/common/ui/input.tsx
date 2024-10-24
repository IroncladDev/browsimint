import { styled } from "react-tailwind-variants"

const Input = styled("input", {
  base: `
    rounded-lg text-sm font-medium transition-colors outline-none w-full text-white border-2 h-10 px-2 py-2

    bg-gray-800/90 border-gray-500/50

    disabled:pointer-events-none disabled:opacity-50 

    focus:border-cyan-500/75 placeholder:text-gray-500`,
})

export default Input
