import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/features/app/layout/AppShell"

const outfitSans = Outfit({
	variable: "--font-outfit-sans",
	subsets: ["latin"]
})

export const metadata: Metadata = {
	title: "Save On X",
	description: ""
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="scroll-smooth">
			<body className={`${outfitSans.variable} antialiased font-sans`}>
				<AppShell>{children}</AppShell>
			</body>
		</html>
	)
}
