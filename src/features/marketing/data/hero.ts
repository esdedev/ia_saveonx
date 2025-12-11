import type { CallToActionContent, HeroValueProp } from "../types"

export const HERO_BADGE = "🚀 Revolutionary X Post Preservation"

export const HERO_TITLE = "Truth Never"

export const HERO_HIGHLIGHT = "Disappears"

export const HERO_DESCRIPTION =
	"Timestamp and preserve X posts forever. Enable journalists, companies, and innovators to demonstrate truth, even when posts vanish."

export const HERO_PRIMARY_ACTION: CallToActionContent["primaryAction"] = {
	label: "Start Timestamping",
	href: "/timestamp",
	variant: "primary",
	icon: "arrowRight"
}

export const HERO_SECONDARY_ACTION: CallToActionContent["secondaryAction"] = {
	label: "Verify a Post",
	href: "/verify",
	variant: "outline",
	icon: "search"
}

export const HERO_VALUE_PROPS: HeroValueProp[] = [
	{
		id: "free",
		icon: "checkCircle",
		label: "3 Free Daily Timestamps",
		accent: "blue"
	},
	{
		id: "secure",
		icon: "shield",
		label: "Cryptographically Secure",
		accent: "purple"
	},
	{
		id: "instant",
		icon: "zap",
		label: "Instant Verification",
		accent: "yellow"
	}
]
