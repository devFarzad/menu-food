import "./globals.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "Gourmet Delights | Interactive Menu",
  description: "Explore our exquisite menu featuring a variety of delicious dishes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} overflow-x-hidden`}>{children}</body>
    </html>
  )
}

