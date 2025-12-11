import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { AppNavigation } from "@/features/app/components/AppNavigation"
import { getServerSession } from "@/services/auth/auth-server"

export default async function AppLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	const session = await getServerSession()

	// Double-check authentication (middleware should handle this, but just in case)
	if (!session) {
		redirect("/login")
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<AppNavigation session={session} />
			{children}
		</div>
	)
}
