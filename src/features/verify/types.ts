/**
 * Verify Feature Types
 *
 * Types specific to the verification flow.
 * For shared types, see: @/types/actions.ts
 */

import type { Verification } from "@/drizzle/schema"

// Re-export shared types for convenience
export type {
	ActionResult,
	BlockchainVerifyResult,
	VerificationStatus
} from "@/types/actions"

// ============================================================================
// ACTION INPUT/OUTPUT TYPES
// ============================================================================

/** Full verification response from verifyPostAction */
export interface VerificationResponse {
	success: boolean
	isTimestamped: boolean
	verification?: Verification
	timestampData?: TimestampData
	blockchainVerification?: BlockchainVerificationData
	postData?: PostData
	currentState?: CurrentStateData
	error?: string
}

/** Timestamp data in verification response */
export interface TimestampData {
	id: string
	blockchain: string
	transactionHash: string | null
	blockNumber: number | null
	explorerUrl: string | null
	timestampedAt: string
	status: "verified" | "modified" | "deleted"
	otsProof?: string | null
}

/** Blockchain verification details */
export interface BlockchainVerificationData {
	verified: boolean
	attestedTime?: Date
	blockNumber?: number
	message: string
}

/** Original post data */
export interface PostData {
	content: string
	authorUsername: string
	authorDisplayName: string | null
	postedAt: string | null
	likesAtCapture: number | null
	retweetsAtCapture: number | null
	repliesAtCapture: number | null
}

/** Current state of the post on X */
export interface CurrentStateData {
	exists: boolean
	isModified: boolean
	similarityPercentage?: number
}

/** Result of verifying by content hash */
export interface VerifyByHashResult {
	found: boolean
	post?: {
		id: string
		xPostUrl: string
		authorUsername: string
		timestampedAt: string
		blockchain: string
	}
}

// Alias for backwards compatibility
export type VerifyPostResult = VerificationResponse

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

/** Verification result for UI components */
export interface VerificationResult {
	isTimestamped: boolean
	postUrl: string
	originalContent: {
		author: string
		handle: string
		content: string
		timestamp: string
		likes: number
		retweets: number
		replies: number
	}
	timestampData: {
		timestampedAt: string
		blockchainHash: string
		verificationHash: string
		status: "verified" | "deleted" | "modified"
	}
}

// ============================================================================
// PDF/CERTIFICATE TYPES
// ============================================================================

/** Digital signature for verification certificates */
export interface DigitalSignature {
	signatureId: string
	publicKey: string
	privateKeyHash: string
	algorithm: "RSA-SHA256" | "ECDSA-SHA256" | "EdDSA"
	signedAt: string
	documentHash: string
	isValid: boolean
}

/** Settings for digital signatures */
export interface DigitalSignatureSettings {
	enabled: boolean
	algorithm: "RSA-SHA256" | "ECDSA-SHA256" | "EdDSA"
	includeTimestamp: boolean
	showPublicKey: boolean
	signatureLevel: "basic" | "advanced" | "qualified"
}

/** Settings for PDF watermarks */
export interface WatermarkSettings {
	enabled: boolean
	text: string
	opacity: number
	position: "diagonal" | "background" | "footer"
	customText: string
	useCustom: boolean
}
