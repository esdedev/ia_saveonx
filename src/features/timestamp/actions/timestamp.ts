"use server"

import type { NewPost, NewTimestamp, Post, Timestamp } from "@/drizzle/schema"
import { postRepository } from "@/features/timestamp/db/posts"
import { timestampRepository } from "@/features/timestamp/db/timestamps"
import type {
	CreateTimestampData,
	PostPreviewData,
	TimestampRequest,
	TimestampResult,
	UserLimitsData
} from "@/features/timestamp/types"
import { userRepository } from "@/features/users/db/users"
import {
	type BlockchainId,
	isOTSBlockchain,
	isValidBlockchain,
	VALID_BLOCKCHAIN_IDS
} from "@/lib/blockchain"
import {
	createEthTimestamp,
	type SupportedChain,
	verifyEthTimestamp
} from "@/services/ethereum-service"
import { fetchXPost, parseXPostUrl } from "@/services/x-service"
import type {
	ActionResult,
	BlockchainTimestampResult,
	BlockchainVerifyResult,
	UpgradeOTSResult
} from "@/types/actions"

// ============================================================================
// INTERNAL TYPES (not exported)
// ============================================================================

// ============================================================================
// INTERNAL HELPER FUNCTIONS (formerly in timestamp-service.ts & blockchain-timestamp-service.ts)
// ============================================================================

/**
 * Check if user can create a new timestamp (within limits)
 */
async function checkUserLimits(userId: string): Promise<UserLimitsData> {
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
 * Create timestamp on specified blockchain
 */

/**
 * Create a new timestamp for a post (internal)
 */




// ============================================================================
// ACTIONS (Public Server Actions)
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
