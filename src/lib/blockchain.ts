/**
 * Blockchain Constants and Types
 * Single source of truth for all blockchain-related configuration
 */

// ============================================================================
// TYPES
// ============================================================================

export type BlockchainId =
	| "bitcoin-ots"
	| "ethereum"
	| "ethereum-sepolia"
	| "polygon"

export type SecurityLevel = "high" | "medium" | "low"

export interface BlockchainConfig {
	id: BlockchainId
	name: string
	symbol: string
	icon: string
	cost: string
	speed: string
	confirmation: string
	security: SecurityLevel
	explorerUrl: string
	description: string
	recommended?: boolean
	isTestnet?: boolean
}

// ============================================================================
// BLOCKCHAIN REGISTRY - Single Source of Truth
// ============================================================================

export const BLOCKCHAINS: Record<BlockchainId, BlockchainConfig> = {
	"bitcoin-ots": {
		id: "bitcoin-ots",
		name: "Bitcoin (OpenTimestamps)",
		symbol: "BTC",
		icon: "₿",
		cost: "Free",
		speed: "10-60 min",
		confirmation: "Bitcoin block confirmation",
		security: "high",
		explorerUrl: "https://mempool.space",
		description:
			"Most trusted and cost-effective. Uses OpenTimestamps protocol.",
		recommended: true
	},
	ethereum: {
		id: "ethereum",
		name: "Ethereum",
		symbol: "ETH",
		icon: "Ξ",
		cost: "$0.50-5",
		speed: "~15 seconds",
		confirmation: "12 confirmations",
		security: "high",
		explorerUrl: "https://etherscan.io",
		description: "Direct on-chain. Instant verification but requires gas."
	},
	"ethereum-sepolia": {
		id: "ethereum-sepolia",
		name: "Ethereum Sepolia",
		symbol: "ETH",
		icon: "Ξ",
		cost: "Free (testnet)",
		speed: "~15 seconds",
		confirmation: "12 confirmations",
		security: "medium",
		explorerUrl: "https://sepolia.etherscan.io",
		description: "Testnet for development and demos.",
		isTestnet: true
	},
	polygon: {
		id: "polygon",
		name: "Polygon",
		symbol: "MATIC",
		icon: "◈",
		cost: "~$0.01",
		speed: "~2 seconds",
		confirmation: "128 confirmations",
		security: "medium",
		explorerUrl: "https://polygonscan.com",
		description: "Fast and cheap with Ethereum security."
	}
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const VALID_BLOCKCHAIN_IDS = Object.keys(BLOCKCHAINS) as BlockchainId[]

export function isValidBlockchain(id: string): id is BlockchainId {
	return id in BLOCKCHAINS
}

export function getBlockchain(id: BlockchainId): BlockchainConfig {
	return BLOCKCHAINS[id]
}

export function getBlockchainList(): BlockchainConfig[] {
	return Object.values(BLOCKCHAINS)
}

export function getBlockchainOptions() {
	return getBlockchainList().map((chain) => ({
		id: chain.id,
		name: chain.name,
		icon: chain.icon,
		cost: chain.cost,
		speed: chain.speed,
		confirmation: chain.confirmation,
		security: chain.security,
		recommended: chain.recommended,
		description: chain.description
	}))
}

export function isOTSBlockchain(id: BlockchainId): boolean {
	return id === "bitcoin-ots"
}

export function isEVMBlockchain(id: BlockchainId): boolean {
	return id !== "bitcoin-ots"
}
