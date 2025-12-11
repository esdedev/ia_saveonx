/**
 * Timestamp Service - Core business logic for timestamping posts
 */

import { postRepository } from "@/features/timestamp/db/posts"
import { timestampRepository } from "@/features/timestamp/db/timestamps"
import { userRepository } from "@/features/users/db/users"
import type { NewPost, NewTimestamp, Post, Timestamp } from "@/drizzle/schema"
import { hashContent } from "@/lib/crypto"
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

		// 6. Create timestamp record
		const newTimestamp: NewTimestamp = {
			userId: request.userId,
			postId: post.id,
			blockchain: request.blockchain,
			contentHash: post.contentHash,
			status: "pending"
		}

		const timestamp = await timestampRepository.create(newTimestamp)

		// 7. Increment user's usage
		await userRepository.incrementTimestampsUsed(request.userId)

		// 8. Queue blockchain transaction (in production, this would be async)
		// For now, simulate immediate confirmation
		await simulateBlockchainTimestamp(timestamp.id, request.blockchain)

		// 9. Fetch updated timestamp
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

// ============================================================================
// BLOCKCHAIN SIMULATION
// ============================================================================

/**
 * Simulate blockchain timestamping
 * In production, replace with actual blockchain integration
 */
async function simulateBlockchainTimestamp(
	timestampId: string,
	blockchain: string
): Promise<void> {
	// Update status to processing
	await timestampRepository.updateStatus(timestampId, "processing")

	// Simulate blockchain delay
	await new Promise((resolve) => setTimeout(resolve, 1000))

	// Generate mock transaction data
	const mockTxHash = `0x${Array.from({ length: 64 }, () =>
		Math.floor(Math.random() * 16).toString(16)
	).join("")}`

	const mockBlockNumber = Math.floor(Math.random() * 1000000) + 18000000
	const mockBlockHash = `0x${Array.from({ length: 64 }, () =>
		Math.floor(Math.random() * 16).toString(16)
	).join("")}`

	// Get explorer URL based on blockchain
	const explorerUrls: Record<string, string> = {
		ethereum: `https://etherscan.io/tx/${mockTxHash}`,
		polygon: `https://polygonscan.com/tx/${mockTxHash}`,
		base: `https://basescan.org/tx/${mockTxHash}`,
		solana: `https://solscan.io/tx/${mockTxHash}`
	}

	// Update with "confirmed" status and transaction details
	await timestampRepository.update(timestampId, {
		status: "confirmed",
		transactionHash: mockTxHash,
		blockNumber: mockBlockNumber,
		blockHash: mockBlockHash,
		explorerUrl: explorerUrls[blockchain] || "",
		confirmations: 12,
		confirmedAt: new Date().toISOString()
	})
}

/**
 * Get blockchain network display info
 */
export function getBlockchainInfo(blockchain: string) {
	const networks: Record<
		string,
		{ name: string; icon: string; color: string; estimatedTime: string }
	> = {
		ethereum: {
			name: "Ethereum",
			icon: "eth",
			color: "#627EEA",
			estimatedTime: "~15 seconds"
		},
		polygon: {
			name: "Polygon",
			icon: "matic",
			color: "#8247E5",
			estimatedTime: "~2 seconds"
		},
		base: {
			name: "Base",
			icon: "base",
			color: "#0052FF",
			estimatedTime: "~2 seconds"
		},
		solana: {
			name: "Solana",
			icon: "sol",
			color: "#14F195",
			estimatedTime: "~400ms"
		}
	}

	return networks[blockchain] || networks.ethereum
}
