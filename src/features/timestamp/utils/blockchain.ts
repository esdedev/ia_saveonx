/**
 * Blockchain Options for UI
 * Re-exports from centralized blockchain config
 */

import type { BlockchainOption } from "@/features/timestamp/types"
import { getBlockchainOptions } from "@/lib/blockchain"

// Get options from centralized config
export const BLOCKCHAIN_OPTIONS: BlockchainOption[] = getBlockchainOptions()

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
