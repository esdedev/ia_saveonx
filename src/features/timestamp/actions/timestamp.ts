"use server"

import { isValidBlockchain, VALID_BLOCKCHAIN_IDS } from "@/lib/blockchain"
import { checkUserLimits, createTimestamp } from "@/services/timestamp-service"
import { fetchXPost, parseXPostUrl } from "@/services/x-service"

// ============================================================================
// TYPES
// ============================================================================

export type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string }

export type PostPreviewData = {
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

export type CreateTimestampData = {
	timestampId: string
	transactionHash: string | null
	post: {
		id: string
		xPostId: string
	}
}

export type UserLimitsData = {
	canTimestamp: boolean
	used: number
	limit: number
	remaining: number
	tier: string
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Fetch post preview data from X/Twitter
 */
export async function fetchPostPreview(
	postUrl: string
): Promise<ActionResult<PostPreviewData>> {
	try {
		// Validate URL format
		const parsed = parseXPostUrl(postUrl)

		if (!parsed.isValid) {
			return { success: false, error: "Invalid X/Twitter post URL" }
		}

		// Fetch post data
		const postData = await fetchXPost(postUrl)

		if (!postData) {
			return {
				success: false,
				error: "Failed to fetch post. It may be deleted or private."
			}
		}

		return {
			success: true,
			data: {
				postId: postData.postId,
				content: postData.content,
				authorUsername: postData.authorUsername,
				authorDisplayName: postData.authorDisplayName,
				authorProfileImage: postData.authorProfileImage ?? null,
				postedAt: postData.postedAt,
				likes: postData.likes,
				retweets: postData.retweets,
				replies: postData.replies,
				views: postData.views ?? null,
				postUrl: postData.postUrl
			}
		}
	} catch (error) {
		console.error("Error in fetchPostPreview:", error)
		return { success: false, error: "Failed to fetch post. Please try again." }
	}
}

/**
 * Create a new timestamp for a post
 */
export async function createTimestampAction(params: {
	userId: string
	postUrl: string
	blockchain: string
}): Promise<ActionResult<CreateTimestampData>> {
	try {
		const { userId, postUrl, blockchain } = params

		// Validate required fields
		if (!userId || !postUrl || !blockchain) {
			return {
				success: false,
				error: "Missing required fields: userId, postUrl, blockchain"
			}
		}

		// Validate blockchain
		if (!isValidBlockchain(blockchain)) {
			return {
				success: false,
				error: `Invalid blockchain. Must be one of: ${VALID_BLOCKCHAIN_IDS.join(", ")}`
			}
		}

		// Create timestamp
		const result = await createTimestamp({ userId, postUrl, blockchain })

		if (!result.success || !result.timestamp || !result.post) {
			return {
				success: false,
				error: result.error || "Failed to create timestamp"
			}
		}

		return {
			success: true,
			data: {
				timestampId: result.timestamp.id,
				transactionHash: result.timestamp.transactionHash,
				post: {
					id: result.post.id,
					xPostId: result.post.xPostId
				}
			}
		}
	} catch (error) {
		console.error("Error in createTimestampAction:", error)
		return {
			success: false,
			error: "Failed to create timestamp. Please try again."
		}
	}
}

/**
 * Get user's timestamp usage limits
 */
export async function getUserLimits(
	userId: string
): Promise<ActionResult<UserLimitsData>> {
	try {
		if (!userId) {
			return { success: false, error: "Missing userId parameter" }
		}

		const limits = await checkUserLimits(userId)

		return {
			success: true,
			data: limits
		}
	} catch (error) {
		console.error("Error in getUserLimits:", error)
		return { success: false, error: "Failed to get user limits" }
	}
}
