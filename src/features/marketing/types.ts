export type MarketingNavigationLink = {
	label: string
	href: string
}

export type NavigationAction = {
	label: string
	href: string
	variant: "primary" | "ghost"
}

export type IconName =
	| "arrowRight"
	| "search"
	| "checkCircle"
	| "shield"
	| "zap"
	| "clock"
	| "users"

export type FeatureHighlight = {
	id: string
	icon: IconName
	title: string
	description: string
	accent: "blue" | "purple" | "green"
}

export type UseCaseHighlight = {
	id: string
	icon: IconName
	title: string
	description: string
	accent: "blue" | "purple" | "green"
}

export type PricingPlan = {
	id: string
	name: string
	price: string
	priceSuffix: string
	features: string[]
	ctaLabel: string
	highlight?: boolean
	badgeLabel?: string
}

export type HeroValueProp = {
	id: string
	icon: IconName
	label: string
	accent: "blue" | "purple" | "yellow"
}

export type CallToActionContent = {
	heading: string
	emphasis: string
	subheading: string
	primaryAction: CallToActionButton
	secondaryAction: CallToActionButton
}

export type CallToActionButton = {
	label: string
	href: string
	variant: "primary" | "outline"
	icon?: IconName
}

export type FooterSection = {
	id: string
	title: string
	links: MarketingNavigationLink[]
}
