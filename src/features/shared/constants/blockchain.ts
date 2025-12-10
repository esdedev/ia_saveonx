// Supported blockchain networks
export const BLOCKCHAIN_NETWORKS = {
	ethereum: {
		id: "ethereum",
		name: "Ethereum",
		symbol: "ETH",
		explorerUrl: "https://etherscan.io"
	},
	polygon: {
		id: "polygon",
		name: "Polygon",
		symbol: "MATIC",
		explorerUrl: "https://polygonscan.com"
	},
	arbitrum: {
		id: "arbitrum",
		name: "Arbitrum",
		symbol: "ETH",
		explorerUrl: "https://arbiscan.io"
	},
	base: {
		id: "base",
		name: "Base",
		symbol: "ETH",
		explorerUrl: "https://basescan.org"
	}
} as const

export type BlockchainNetworkId = keyof typeof BLOCKCHAIN_NETWORKS

// Timestamp status values
export const TIMESTAMP_STATUS = {
	pending: "pending",
	confirmed: "confirmed",
	failed: "failed"
} as const

export type TimestampStatus =
	(typeof TIMESTAMP_STATUS)[keyof typeof TIMESTAMP_STATUS]

// Verification status values
export const VERIFICATION_STATUS = {
	verified: "verified",
	notFound: "not_found",
	deleted: "deleted",
	pending: "pending"
} as const

export type VerificationStatus =
	(typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS]
