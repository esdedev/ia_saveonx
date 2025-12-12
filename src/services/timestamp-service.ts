/**
 * Timestamp Service - Core business logic for timestamping posts
 */

import type { NewPost, NewTimestamp, Post, Timestamp } from "@/drizzle/schema"
import { postRepository } from "@/features/timestamp/db/posts"
import { timestampRepository } from "@/features/timestamp/db/timestamps"
import { userRepository } from "@/features/users/db/users"
import type { BlockchainId } from "@/lib/blockchain"
import { hashContent, hashSHA256 } from "@/lib/crypto"
import { createBlockchainTimestamp } from "@/services/blockchain-timestamp-service"
import { fetchXPost, parseXPostUrl } from "@/services/x-service"

// ============================================================================
// TYPES
// ============================================================================

export interface TimestampRequest {
	userId: string
	postUrl: string
	blockchain: string
}

export interface TimestampResult {
	success: boolean
	timestamp?: Timestamp
	post?: Post
	error?: string
}

export interface UserLimitCheck {
	canTimestamp: boolean
	used: number
	limit: number
	remaining: number
	tier: string
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Check if user can create a new timestamp (within limits)
 */
export async function checkUserLimits(userId: string): Promise<UserLimitCheck> {
	const user = await userRepository.findById(userId)

	if (!user) {
		return {
			canTimestamp: false,
			used: 0,
			limit: 0,
			remaining: 0,
			tier: "unknown"
		}
	}

	const remaining = user.timestampsLimit - user.timestampsUsedThisMonth

	return {
		canTimestamp: remaining > 0,
		used: user.timestampsUsedThisMonth,
		limit: user.timestampsLimit,
		remaining: Math.max(0, remaining),
		tier: user.subscriptionTier
	}
}

/**
 * Create a new timestamp for a post
 */
export async function createTimestamp(
	request: TimestampRequest
): Promise<TimestampResult> {
	try {
		// 1. Check user limits
		const limits = await checkUserLimits(request.userId)
		if (!limits.canTimestamp) {
			return {
				success: false,
				error: `Monthly limit reached (${limits.used}/${limits.limit}). Upgrade your plan for more timestamps.`
			}
		}

		// 2. Parse and validate URL
		const parsed = parseXPostUrl(request.postUrl)
		if (!parsed.isValid || !parsed.postId) {
			return {
				success: false,
				error: "Invalid X/Twitter post URL"
			}
		}

		// 3. Check if post already timestamped
		let post = await postRepository.findByXPostId(parsed.postId)

		if (post) {
			// Post exists, check if already timestamped on this blockchain
			const existingTimestamps = await timestampRepository.findByPostId(post.id)
			const sameBlockchain = existingTimestamps.find(
				(t) => t.blockchain === request.blockchain && t.status === "confirmed"
			)

			if (sameBlockchain) {
				return {
					success: false,
					error: `This post is already timestamped on ${request.blockchain}`,
					post,
					timestamp: sameBlockchain
				}
			}
		} else {
			// 4. Fetch post data from X
			const postData = await fetchXPost(request.postUrl)

			if (!postData) {
				return {
					success: false,
					error:
						"Failed to fetch post from X. Please check the URL and try again."
				}
			}

			// 5. Create post record
			const contentHash = await hashContent(postData.content)

			const newPost: NewPost = {
				userId: request.userId,
				xPostId: postData.postId,
				xPostUrl: postData.postUrl,
				authorUsername: postData.authorUsername,
				authorDisplayName: postData.authorDisplayName,
				authorProfileImage: postData.authorProfileImage,
				content: postData.content,
				contentHash,
				likesAtCapture: postData.likes,
				retweetsAtCapture: postData.retweets,
				repliesAtCapture: postData.replies,
				postedAt: postData.postedAt
			}

			post = await postRepository.create(newPost)
		}

		// 6. Prepare blockchain hash (SHA-256) and create timestamp record (initial status: pending)
		const contentHashSha256 = await hashSHA256(post.content)
		const newTimestamp: NewTimestamp = {
			userId: request.userId,
			postId: post.id,
			blockchain: request.blockchain,
			contentHash: contentHashSha256,
			status: "processing"
		}

		const timestamp = await timestampRepository.create(newTimestamp)

		// 7. Increment user's usage
		await userRepository.incrementTimestampsUsed(request.userId)

		// 8. Create blockchain timestamp (using the same SHA-256 hash stored on the timestamp)
		const blockchainResult = await createBlockchainTimestamp(
			contentHashSha256,
			request.blockchain as BlockchainId
		)

		if (!blockchainResult.success) {
			// Update timestamp with error
			await timestampRepository.update(timestamp.id, {
				status: "failed",
				errorMessage: blockchainResult.error || blockchainResult.message
			})

			return {
				success: false,
				error: blockchainResult.error || blockchainResult.message,
				post,
				timestamp
			}
		}

		// 9. Update timestamp with blockchain data
		const updateData: Partial<NewTimestamp> = {
			status: blockchainResult.status,
			transactionHash: blockchainResult.transactionHash,
			blockNumber: blockchainResult.blockNumber,
			explorerUrl: blockchainResult.explorerUrl,
			otsProof: blockchainResult.otsProof,
			otsPending: blockchainResult.blockchain === "bitcoin-ots" ? 1 : 0,
			confirmedAt:
				blockchainResult.status === "confirmed"
					? new Date().toISOString()
					: undefined
		}

		await timestampRepository.update(timestamp.id, updateData)

		// 10. Fetch updated timestamp
		const confirmedTimestamp = await timestampRepository.findById(timestamp.id)

		return {
			success: true,
			timestamp: confirmedTimestamp || timestamp,
			post
		}
	} catch (error) {
		console.error("Error creating timestamp:", error)
		return {
			success: false,
			error: "An unexpected error occurred. Please try again."
		}
	}
}

/**
 * Get timestamp with full post details
 */
export async function getTimestampWithPost(timestampId: string) {
	return timestampRepository.findWithPost(timestampId)
}

/**
 * Get user's timestamps with posts
 */
export async function getUserTimestamps(userId: string, limit = 50) {
	return timestampRepository.findUserTimestampsWithPosts(userId, limit)
}

/**
 * Get pending timestamps (for processing queue)
 */
export async function getPendingTimestamps() {
	return timestampRepository.findPending()
}

// (Simulation helpers removed to avoid duplication and unused code)
// BLOCKCHAIN SIMULATION
