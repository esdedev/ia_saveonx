/**
 * Shared Action Types
 *
 * This file contains types that are used across multiple server actions.
 * Keep action-specific types in their respective feature's types.ts file.
 */

// ============================================================================
// CORE ACTION RESULT TYPE
// ============================================================================

/**
 * Standard result wrapper for all server actions.
 * Provides consistent success/error handling across the app.
 *
 * @example
 * // Success case
 * return { success: true, data: { id: "123" } }
 *
 * // Error case
 * return { success: false, error: "Something went wrong" }
 */
export type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string }

// ============================================================================
// TIMESTAMP STATUS TYPES
// ============================================================================

/** Status of a timestamp in the database */
export type TimestampStatus =
	| "pending"
	| "processing"
	| "confirmed"
	| "failed"
	| "error"

/** Verification status when checking a post */
export type VerificationStatus = "verified" | "modified" | "deleted"

// ============================================================================
// BLOCKCHAIN TYPES (Shared between timestamp & verify)
// ============================================================================

/**
 * Result of creating a timestamp on any blockchain
 */
export interface BlockchainTimestampResult {
	success: boolean
	blockchain: string
	contentHash: string
	status: TimestampStatus
	transactionHash?: string
	otsProof?: string
	blockNumber?: number
	explorerUrl?: string
	message: string
	error?: string
}

/**
 * Result of verifying a timestamp on any blockchain
 */
export interface BlockchainVerifyResult {
	verified: boolean
	blockchain: string
	attestedTime?: Date
	blockNumber?: number
	message: string
	error?: string
}

// ============================================================================
// CRON/BACKGROUND JOB TYPES
// ============================================================================

/**
 * Result of upgrading pending OTS timestamps
 */
export interface UpgradeOTSResult {
	checked: number
	upgraded: number
	errors: number
	details?: Array<{
		id: string
		status: "upgraded" | "pending" | "error"
		message?: string
	}>
}
