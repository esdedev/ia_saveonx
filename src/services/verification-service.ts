/**
 * Verification Service - Core business logic for verifying timestamped posts
 */

import type { NewVerification, Verification } from "@/drizzle/schema"
import { postRepository } from "@/features/timestamp/db/posts"
import { timestampRepository } from "@/features/timestamp/db/timestamps"
import { verificationRepository } from "@/features/verify/db/verifications"
import type { BlockchainId } from "@/lib/blockchain"
import {
	calculateSimilarity,
	hashContent,
	verifyContentIntegrity
} from "@/lib/crypto"
import { verifyBlockchainTimestamp } from "@/services/blockchain-timestamp-service"
import { checkPostExists, parseXPostUrl } from "@/services/x-service"

// ============================================================================
// TYPES
// ============================================================================

export interface VerificationRequest {
	postUrl: string
	userId?: string // Optional - can verify without being logged in
	ipAddress?: string
	userAgent?: string
}

export interface VerificationResponse {
	success: boolean
	isTimestamped: boolean
	verification?: Verification
	timestampData?: {
		id: string
		blockchain: string
		transactionHash: string | null
		blockNumber: number | null
		explorerUrl: string | null
		timestampedAt: string
		status: "verified" | "modified" | "deleted"
		otsProof?: string | null // Base64 encoded .ots file for download
	}
	blockchainVerification?: {
		verified: boolean
		attestedTime?: Date
		blockNumber?: number
		message: string
	}
	postData?: {
		content: string
		authorUsername: string
		authorDisplayName: string | null
		postedAt: string | null
		likesAtCapture: number | null
		retweetsAtCapture: number | null
		repliesAtCapture: number | null
	}
	currentState?: {
		exists: boolean
		isModified: boolean
		similarityPercentage?: number
	}
	error?: string
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Verify a post's timestamp
 */
export async function verifyPost(
	request: VerificationRequest
): Promise<VerificationResponse> {
	try {
		// 1. Parse URL
		const parsed = parseXPostUrl(request.postUrl)

		if (!parsed.isValid || !parsed.postId) {
			return {
				success: false,
				isTimestamped: false,
				error: "Invalid X/Twitter post URL"
			}
		}

		// 2. Find the post in our database
		const post = await postRepository.findByXPostId(parsed.postId)

		if (!post) {
			return {
				success: true,
				isTimestamped: false,
				error: "This post has not been timestamped with SaveOnX"
			}
		}

		// 3. Get the most recent confirmed timestamp
		const timestamps = await timestampRepository.findByPostId(post.id)
		const confirmedTimestamp = timestamps.find((t) => t.status === "confirmed")

		if (!confirmedTimestamp) {
			return {
				success: true,
				isTimestamped: false,
				error:
					"This post has a pending timestamp that hasn't been confirmed yet"
			}
		}

		// 4. Check current state of the post on X
		const currentState = await checkPostExists(request.postUrl)

		let verificationStatus: "verified" | "modified" | "deleted" = "verified"
		let similarityPercentage: number | undefined
		let isModified = false

		if (!currentState.exists) {
			verificationStatus = "deleted"
		} else if (currentState.currentContent) {
			// Compare content
			const isIntact = await verifyContentIntegrity(
				post.contentHash,
				currentState.currentContent
			)

			if (!isIntact) {
				verificationStatus = "modified"
				isModified = true
				similarityPercentage = calculateSimilarity(
					post.content,
					currentState.currentContent
				)
			}
		}

		// 5. Create verification record
		const currentContentHash = currentState.currentContent
			? await hashContent(currentState.currentContent)
			: null

		const newVerification: NewVerification = {
			userId: request.userId || null,
			timestampId: confirmedTimestamp.id,
			requestedPostUrl: request.postUrl,
			requestedContentHash: post.contentHash,
			isVerified: verificationStatus === "verified" ? "true" : "false",
			matchPercentage:
				similarityPercentage || (verificationStatus === "verified" ? 100 : 0),
			currentContent: currentState.currentContent || null,
			currentContentHash,
			isPostDeleted: currentState.exists ? "false" : "true",
			isPostModified: isModified ? "true" : "false",
			ipAddress: request.ipAddress || null,
			userAgent: request.userAgent || null
		}

		const verification = await verificationRepository.create(newVerification)

		// 6. Verify on blockchain (optional - for extra trust)
		let blockchainVerification: VerificationResponse["blockchainVerification"]

		if (confirmedTimestamp.transactionHash || confirmedTimestamp.otsProof) {
			const blockchainResult = await verifyBlockchainTimestamp(
				confirmedTimestamp.blockchain as BlockchainId,
				// Use the stored SHA-256 hash saved on the timestamp record
				confirmedTimestamp.contentHash,
				{
					transactionHash: confirmedTimestamp.transactionHash || undefined,
					otsProof: confirmedTimestamp.otsProof || undefined
				}
			)

			blockchainVerification = {
				verified: blockchainResult.verified,
				attestedTime: blockchainResult.attestedTime,
				blockNumber: blockchainResult.blockNumber,
				message: blockchainResult.message
			}
		}

		// 7. Return full verification response
		return {
			success: true,
			isTimestamped: true,
			verification,
			timestampData: {
				id: confirmedTimestamp.id,
				blockchain: confirmedTimestamp.blockchain,
				transactionHash: confirmedTimestamp.transactionHash,
				blockNumber: confirmedTimestamp.blockNumber,
				explorerUrl: confirmedTimestamp.explorerUrl,
				timestampedAt:
					confirmedTimestamp.confirmedAt ||
					confirmedTimestamp.createdAt.toISOString(),
				status: verificationStatus,
				otsProof: confirmedTimestamp.otsProof
			},
			blockchainVerification,
			postData: {
				content: post.content,
				authorUsername: post.authorUsername,
				authorDisplayName: post.authorDisplayName,
				postedAt: post.postedAt,
				likesAtCapture: post.likesAtCapture,
				retweetsAtCapture: post.retweetsAtCapture,
				repliesAtCapture: post.repliesAtCapture
			},
			currentState: {
				exists: currentState.exists,
				isModified,
				similarityPercentage
			}
		}
	} catch (error) {
		console.error("Error verifying post:", error)
		return {
			success: false,
			isTimestamped: false,
			error: "An unexpected error occurred during verification"
		}
	}
}

/**
 * Get verification by ID with full details
 */
export async function getVerificationDetails(verificationId: string) {
	return verificationRepository.findWithTimestamp(verificationId)
}

/**
 * Get recent public verifications (for homepage/stats)
 */
export async function getRecentVerifications(limit = 10) {
	return verificationRepository.getRecentPublicVerifications(limit)
}

/**
 * Get user's verification history
 */
export async function getUserVerifications(userId: string, limit = 50) {
	return verificationRepository.findByUserId(userId, limit)
}

/**
 * Verify by content hash directly (for API usage)
 */
export async function verifyByContentHash(contentHash: string): Promise<{
	found: boolean
	post?: {
		id: string
		xPostUrl: string
		authorUsername: string
		timestampedAt: string
		blockchain: string
	}
}> {
	const post = await postRepository.findByContentHash(contentHash)

	if (!post) {
		return { found: false }
	}

	const timestamps = await timestampRepository.findByPostId(post.id)
	const confirmedTimestamp = timestamps.find((t) => t.status === "confirmed")

	if (!confirmedTimestamp) {
		return { found: false }
	}

	return {
		found: true,
		post: {
			id: post.id,
			xPostUrl: post.xPostUrl,
			authorUsername: post.authorUsername,
			timestampedAt:
				confirmedTimestamp.confirmedAt ||
				confirmedTimestamp.createdAt.toISOString(),
			blockchain: confirmedTimestamp.blockchain
		}
	}
}
