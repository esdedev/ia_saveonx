"use client"

import { BaseNavigation, type NavLink } from "@/features/shared/components/BaseNavigation"
import type { MarketingNavigationLink, NavigationAction } from "../types"

type MarketingNavigationProps = {
	links: MarketingNavigationLink[]
	primaryAction: NavigationAction
	secondaryAction: NavigationAction
}

export function MarketingNavigation({
	links,
	primaryAction,
	secondaryAction
}: MarketingNavigationProps) {
	// Convert to BaseNavigation format
	const navLinks: NavLink[] = links.map((link) => ({
		label: link.label,
		href: link.href
	}))

	return (
		<BaseNavigation
			links={navLinks}
			secondaryAction={secondaryAction}
			primaryAction={primaryAction}
		/>
	)
}
