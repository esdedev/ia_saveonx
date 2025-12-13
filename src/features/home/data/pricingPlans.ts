import type { PricingPlan } from "../types"

export const PRICING_PLANS: PricingPlan[] = [
	{
		id: "free",
		name: "Free",
		price: "$0",
		priceSuffix: "/month",
		features: [
			"3 timestamps per day",
			"Basic verification",
			"Community support"
		],
		ctaLabel: "Get Started Free"
	},
	{
		id: "professional",
		name: "Professional",
		price: "$29",
		priceSuffix: "/month",
		features: [
			"1,000 timestamps/month",
			"Advanced verification",
			"API access",
			"Priority support"
		],
		ctaLabel: "Start Professional",
		highlight: true,
		badgeLabel: "Most Popular"
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: "Custom",
		priceSuffix: " pricing",
		features: [
			"Unlimited timestamps",
			"White-label solution",
			"Dedicated support",
			"Custom integrations"
		],
		ctaLabel: "Contact Sales"
	}
]
