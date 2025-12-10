import type { BlockchainOption } from "@/features/timestamp/types"

export const BLOCKCHAIN_OPTIONS: BlockchainOption[] = [
	{
		id: "ethereum",
		name: "Ethereum",
		icon: "Ξ",
		cost: "$2.50",
		speed: "~12 minutes",
		confirmation: "12 confirmations",
		security: "high"
	},
	{
		id: "bitcoin",
		name: "Bitcoin",
		icon: "₿",
		cost: "$1.80",
		speed: "~30 minutes",
		confirmation: "6 confirmations",
		security: "high"
	},
	{
		id: "polygon",
		name: "Polygon",
		icon: "◈",
		cost: "$0.15",
		speed: "~2 minutes",
		confirmation: "128 confirmations",
		security: "medium"
	},
	{
		id: "opentimestamps",
		name: "OpenTimestamps",
		icon: "⏱",
		cost: "Free",
		speed: "Instant",
		confirmation: "Ongoing",
		security: "medium"
	}
]

const parseCost = (cost: string): number => {
	if (cost.trim().toLowerCase() === "free") {
		return 0
	}

	const numericValue = cost.replace("$", "").trim()
	const parsed = Number.parseFloat(numericValue)

	return Number.isFinite(parsed) ? parsed : 0
}

export const calculateTotalCost = (
	selectedNetworkIds: string[],
	options: BlockchainOption[]
): number =>
	selectedNetworkIds.reduce((total, networkId) => {
		const option = options.find((item) => item.id === networkId)
		return total + (option ? parseCost(option.cost) : 0)
	}, 0)
