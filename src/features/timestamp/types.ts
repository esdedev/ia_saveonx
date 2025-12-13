/**
 * Timestamp Feature Types
 *
 * Types specific to the timestamp creation flow.
 * For shared types, see: @/types/actions.ts
 */

// ============================================================================
// UI/WIZARD TYPES
// ============================================================================

/** Steps in the timestamp creation wizard */
export type TimestampStep = "input" | "preview" | "networks" | "confirmation"

/** Security level for blockchain options */
export type SecurityLevel = "high" | "medium" | "low"

// ============================================================================
// ACTION INPUT/OUTPUT TYPES
// ============================================================================

/** Data returned when fetching a post preview */
export interface PostPreviewData {
	postId: string
	content: string
	authorUsername: string
	authorDisplayName: string
	authorProfileImage: string | null
	postedAt: string | null
	likes: number
	retweets: number
	replies: number
	views: number | null
	postUrl: string
}

/** Data returned when creating a timestamp */
export interface CreateTimestampData {
	timestampId: string
	transactionHash: string | null
	post: {
		id: string
		xPostId: string
	}
}

/** User's timestamp usage limits */
export interface UserLimitsData {
	canTimestamp: boolean
	used: number
	limit: number
	remaining: number
	tier: string
}

// ============================================================================
// INTERNAL SERVICE TYPES
// ============================================================================

/** Request to create a timestamp (internal) */
export interface TimestampRequest {
	userId: string
	postUrl: string
	blockchain: string
}

/** Result of creating a timestamp (internal) */
export interface TimestampResult {
	success: boolean
	timestamp?: {
		id: string
		transactionHash: string | null
		[key: string]: unknown
	}
	post?: {
		id: string
		xPostId: string
		[key: string]: unknown
	}
	error?: string
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

/** Post preview data for UI components */
export interface PostPreview {
	author: string
	handle: string
	content: string
	timestamp: string
	likes: number
	retweets: number
	replies: number
	profileImage?: string
}

/** Blockchain option for selection UI */
export interface BlockchainOption {
	id: string
	name: string
	icon: string
	cost: string
	speed: string
	confirmation: string
	security: SecurityLevel
	recommended?: boolean
	description?: string
}

/** Result after submitting to blockchain */
export interface SubmissionResult {
	transactionId: string
	hash: string
}
