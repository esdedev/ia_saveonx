// Application routes
export const ROUTES = {
	home: "/",
	dashboard: "/dashboard",
	settings: "/dashboard/settings",
	verify: "/verify",
	timestamp: "/timestamp",
	signIn: "/login",
	getStarted: "/register"
} as const

// External links
export const EXTERNAL_LINKS = {
	x: "https://x.com",
	twitter: "https://twitter.com",
	github: "https://github.com/saveonx",
	docs: "https://docs.saveonx.com"
} as const

// App configuration
export const APP_CONFIG = {
	name: "SaveOnX",
	tagline: "Preserve truth on the blockchain",
	supportEmail: "support@saveonx.com"
} as const

// Default navigation links for authenticated pages
export const DASHBOARD_NAV_LINKS = [
	{ label: "Dashboard", href: ROUTES.dashboard },
	{ label: "Verify", href: ROUTES.verify },
	{ label: "Settings", href: ROUTES.settings },
	{ label: "Timestamp", href: ROUTES.timestamp }
] as const

// Default navigation links for public pages
export const PUBLIC_NAV_LINKS = [
	{ label: "Home", href: ROUTES.home },
	{ label: "Verify", href: ROUTES.verify },
	{ label: "Dashboard", href: ROUTES.dashboard }
] as const

// Marketing navigation links
export const MARKETING_NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "Verify", href: "#verify" },
	{ label: "Pricing", href: "#pricing" }
] as const
