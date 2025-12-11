import type { ReactNode } from "react"
import { AppNavigation } from "@/features/app/components/AppNavigation"

export default function AppLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<div className="min-h-screen bg-black text-white">
			<AppNavigation />
			{children}
		</div>
	)
}
