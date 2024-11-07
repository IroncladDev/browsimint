import QRCode from "react-qr-code"
import colors from "tailwindcss/colors"

export function QrCode({ value }: { value: string }) {
  return (
    <QRCode
      size={256}
      className="h-auto max-w-[256px] w-full"
      bgColor="#0000"
      fgColor={colors.sky["200"]}
      value={value}
      viewBox={`0 0 256 256`}
    />
  )
}
