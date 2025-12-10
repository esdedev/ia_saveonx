import type { MarketingNavigationLink, NavigationAction } from "../types"

export const NAVIGATION_LINKS: MarketingNavigationLink[] = [
	{ label: "Features", href: "#features" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "Verify", href: "verify" }
]

export const PRIMARY_NAV_ACTION: NavigationAction = {
	label: "Get Started",
	href: "#get-started",
	variant: "primary"
}

export const SECONDARY_NAV_ACTION: NavigationAction = {
	label: "Sign In",
	href: "/signin",
	variant: "ghost"
}
