"use server"

import type { NewPost, NewTimestamp, Post, Timestamp } from "@/drizzle/schema"
import { postRepository } from "@/features/timestamp/db/posts"
import { timestampRepository } from "@/features/timestamp/db/timestamps"
import type {
	CreateTimestampData,
	PostPreviewData,
	TimestampRequest,
	UserLimitsData
} from "@/features/timestamp/types"
import { userRepository } from "@/features/users/db/users"
import {
	type BlockchainId,
	isOTSBlockchain,
	isValidBlockchain,
	VALID_BLOCKCHAIN_IDS
} from "@/lib/blockchain"
import { hashContent, hashSHA256 } from "@/lib/crypto"
import {
	createEthTimestamp,
	type SupportedChain,
	verifyEthTimestamp
} from "@/services/ethereum-service"
import {
	otsStamp,
	otsUpgrade,
	otsVerify
} from "@/services/opentimestamps-service"
import { fetchXPost, parseXPostUrl } from "@/services/x-service"
import type {
	ActionResult,
	BlockchainTimestampResult,
	BlockchainVerifyResult,
	UpgradeOTSResult
} from "@/types/actions"

// Re-export types for external consumers
export type {
	ActionResult,
	BlockchainTimestampResult,
	CreateTimestampData,
	PostPreviewData,
	UpgradeOTSResult,
	UserLimitsData
} from "@/features/timestamp/types"

// ============================================================================
// INTERNAL TYPES (not exported)
// ============================================================================

interface TimestampResult {
	success: boolean
	timestamp?: Timestamp
	post?: Post
	error?: string
}

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
async function createBlockchainTimestamp(
	sha256Hash: string,
	blockchain: BlockchainId
): Promise<BlockchainTimestampResult> {
	const baseResult = { blockchain, contentHash: sha256Hash }

	if (isOTSBlockchain(blockchain)) {
		const result = await otsStamp(sha256Hash)

		if (!result.success) {
			return {
				...baseResult,
				success: false,
				status: "error",
				message: result.message,
				error: result.error
			}
		}

		return {
			...baseResult,
			success: true,
			status: "pending",
			otsProof: result.otsProofBase64,
			message: result.message
		}
	}

	// EVM chains
	const result = await createEthTimestamp(
		sha256Hash,
		blockchain as SupportedChain
	)

	if (!result.success) {
		return {
			...baseResult,
			success: false,
			status: "error",
			message: result.message,
			error: result.error
		}
	}

	return {
		...baseResult,
		success: true,
		status: result.status,
		transactionHash: result.transactionHash,
		blockNumber: result.blockNumber ? Number(result.blockNumber) : undefined,
		explorerUrl: result.explorerUrl,
		message: result.message
	}
}

/**
 * Create a new timestamp for a post (internal)
 */
async function createTimestamp(
	request: TimestampRequest
): Promise<TimestampResult> {
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
}

/**
 * Verify timestamp on blockchain
 */
export async function verifyBlockchainTimestamp(
	blockchain: BlockchainId,
	sha256Hash: string,
	proof: { transactionHash?: string; otsProof?: string }
): Promise<BlockchainVerifyResult> {
	if (isOTSBlockchain(blockchain)) {
		if (!proof.otsProof) {
			return {
				verified: false,
				blockchain,
				message: "No OTS proof provided",
				error: "Missing otsProof"
			}
		}

		const result = await otsVerify(proof.otsProof, sha256Hash)

		return {
			verified: result.status === "confirmed",
			blockchain,
			attestedTime: result.attestedTime,
			blockNumber: result.blockHeight,
			message: result.message,
			error: result.error
		}
	}

	// EVM chains
	if (!proof.transactionHash) {
		return {
			verified: false,
			blockchain,
			message: "No transaction hash provided",
			error: "Missing transactionHash"
		}
	}

	const result = await verifyEthTimestamp(
		proof.transactionHash as `0x${string}`,
		sha256Hash,
		blockchain as SupportedChain
	)

	return {
		verified: result.verified,
		blockchain,
		attestedTime: result.timestamp,
		blockNumber: result.blockNumber ? Number(result.blockNumber) : undefined,
		message: result.message,
		error: result.error
	}
}

/**
 * Upgrade pending OTS timestamps (run periodically via cron)
 */
export async function upgradePendingOTSTimestamps(): Promise<UpgradeOTSResult> {
	const stats: UpgradeOTSResult = {
		checked: 0,
		upgraded: 0,
		errors: 0,
		details: []
	}

	try {
		const pending = await timestampRepository.findPendingOTS()

		for (const ts of pending) {
			stats.checked++
			if (!ts.otsProof) continue

			try {
				const result = await otsUpgrade(ts.otsProof, ts.contentHash)

				if (result.status === "confirmed") {
					await timestampRepository.update(ts.id, {
						status: "confirmed",
						otsProof: result.otsProofBase64,
						otsPending: 0,
						blockNumber: result.blockHeight,
						confirmedAt: result.attestedTime?.toISOString()
					})
					stats.upgraded++
					stats.details?.push({ id: ts.id, status: "upgraded" })
				} else {
					stats.details?.push({
						id: ts.id,
						status: "pending",
						message: result.message
					})
				}
			} catch (err) {
				stats.errors++
				stats.details?.push({
					id: ts.id,
					status: "error",
					message: String(err)
				})
			}
		}
	} catch (error) {
		console.error("upgradePendingOTSTimestamps error:", error)
	}

	return stats
}

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
