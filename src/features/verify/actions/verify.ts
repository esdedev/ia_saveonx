"use server"

import { headers } from "next/headers"
import {
	verifyPost,
	verifyByContentHash,
	type VerificationResponse
} from "@/lib/verification-service"

// ============================================================================
// TYPES
// ============================================================================

export type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string }

export type VerifyPostResult = VerificationResponse

export type VerifyByHashResult = {
	found: boolean
	post?: {
		id: string
		xPostUrl: string
		authorUsername: string
		timestampedAt: string
		blockchain: string
	}
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Verify a timestamped post by URL
 */
export async function verifyPostAction(params: {
	postUrl: string
	userId?: string
}): Promise<ActionResult<VerifyPostResult>> {
	try {
		const { postUrl, userId } = params

		if (!postUrl) {
			return { success: false, error: "Missing required field: postUrl" }
		}

		// Get client info for verification record
		const headersList = await headers()
		const ipAddress =
			headersList.get("x-forwarded-for")?.split(",")[0] ||
			headersList.get("x-real-ip") ||
			"unknown"
		const userAgent = headersList.get("user-agent") || "unknown"

		const result = await verifyPost({
			postUrl,
			userId,
			ipAddress,
			userAgent
		})

		if (!result.success) {
			return { success: false, error: result.error || "Verification failed" }
		}

		return { success: true, data: result }
	} catch (error) {
		console.error("Error in verifyPostAction:", error)
		return {
			success: false,
			error: "Failed to verify post. Please try again."
		}
	}
}

/**
 * Verify by content hash (for API/SDK usage)
 */
export async function verifyByHashAction(
	hash: string
): Promise<ActionResult<VerifyByHashResult>> {
	try {
		if (!hash) {
			return { success: false, error: "Missing hash parameter" }
		}

		const result = await verifyByContentHash(hash)

		return { success: true, data: result }
	} catch (error) {
		console.error("Error in verifyByHashAction:", error)
		return {
			success: false,
			error: "Failed to verify by hash. Please try again."
		}
	}
}
