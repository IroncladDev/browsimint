import tailwindCssAnimate from "tailwindcss-animate"
import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{html,css,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        "1.5": "1.5px",
      },
    },
  },
  plugins: [tailwindCssAnimate],
}

export default config
