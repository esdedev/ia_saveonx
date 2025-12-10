"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { MarketingFooter } from "@/features/marketing/components/MarketingFooter"
import { MarketingNavigation } from "@/features/marketing/components/MarketingNavigation"
import { FOOTER_SECTIONS } from "@/features/marketing/data/footer"
import {
	NAVIGATION_LINKS,
	PRIMARY_NAV_ACTION,
	SECONDARY_NAV_ACTION
} from "@/features/marketing/data/navigation"

type AppShellProps = {
	children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname()
	const showMarketingChrome = pathname === "/"

	return (
		<div className="min-h-screen bg-black text-white flex flex-col">
			{showMarketingChrome ? (
				<MarketingNavigation
					links={NAVIGATION_LINKS}
					primaryAction={PRIMARY_NAV_ACTION}
					secondaryAction={SECONDARY_NAV_ACTION}
				/>
			) : null}

			<main className="flex-1">{children}</main>

			{showMarketingChrome ? (
				<MarketingFooter sections={FOOTER_SECTIONS} />
			) : null}
		</div>
	)
}
