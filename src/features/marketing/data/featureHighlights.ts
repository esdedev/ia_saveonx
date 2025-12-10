import type { FeatureHighlight } from "../types"

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
	{
		id: "timestamping",
		icon: "clock",
		title: "Instant Timestamping",
		description:
			"Preserve any X post in seconds with cryptographic proof of existence. Our high-concurrency infrastructure handles thousands of requests simultaneously.",
		accent: "blue"
	},
	{
		id: "security",
		icon: "shield",
		title: "Unbreakable Security",
		description:
			"Military-grade encryption and blockchain-backed verification ensure your timestamped content remains tamper-proof forever.",
		accent: "purple"
	},
	{
		id: "verification",
		icon: "search",
		title: "Universal Verification",
		description:
			"Verify any post's authenticity instantly, even if it's been deleted. Perfect for journalists, legal professionals, and researchers.",
		accent: "green"
	}
]
