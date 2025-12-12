/**
 * Blockchain Constants
 * Re-exports from centralized blockchain config
 */

export {
	BLOCKCHAINS as BLOCKCHAIN_NETWORKS,
	type BlockchainId as BlockchainNetworkId,
	getBlockchain,
	getBlockchainList,
	isEVMBlockchain,
	isOTSBlockchain,
	isValidBlockchain,
	VALID_BLOCKCHAIN_IDS
} from "@/lib/blockchain"

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
