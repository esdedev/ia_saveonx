"use server"

import { sql } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { TimestampTable } from "@/drizzle/schema/timestamp"
import { VerificationTable } from "@/drizzle/schema/verification"
import { timestampRepository } from "@/features/timestamp/db/timestamps"
import { userRepository } from "@/features/users/db/users"
import { verificationRepository } from "@/features/verify/db/verifications"
import { getServerSession } from "@/services/auth/auth-server"

// ============================================================================
// TYPES
// ============================================================================

export type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string }

export interface DashboardStats {
	totalTimestamps: number
	thisMonth: number
	verifications: number
	remaining: number
	limit: number
	tier: string
}

export interface DashboardTimestamp {
	id: string
	postUrl: string
	author: string
	content: string
	timestampedAt: string
	status: "verified" | "pending" | "failed"
	networks: string[]
	cost: string
	verificationCount: number
	transactionHash: string | null
	explorerUrl: string | null
	otsProof: string | null
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Get dashboard stats for the current user
 */
export async function getDashboardStats(): Promise<
	ActionResult<DashboardStats>
> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const userId = session.user.id

		// Get user info for limits
		const user = await userRepository.findById(userId)
		if (!user) {
			return { success: false, error: "User not found" }
		}

		// Count total timestamps
		const [totalResult] = await db
			.select({ count: sql<number>`count(*)` })
			.from(TimestampTable)
			.where(sql`${TimestampTable.userId} = ${userId}`)

		// Count timestamps this month
		const startOfMonth = new Date()
		startOfMonth.setDate(1)
		startOfMonth.setHours(0, 0, 0, 0)

		const [monthResult] = await db
			.select({ count: sql<number>`count(*)` })
			.from(TimestampTable)
			.where(
				sql`${TimestampTable.userId} = ${userId} AND ${TimestampTable.createdAt} >= ${startOfMonth}`
			)

		// Count verifications on user's timestamps
		const [verificationsResult] = await db
			.select({ count: sql<number>`count(*)` })
			.from(VerificationTable)
			.innerJoin(
				TimestampTable,
				sql`${VerificationTable.timestampId} = ${TimestampTable.id}`
			)
			.where(sql`${TimestampTable.userId} = ${userId}`)

		return {
			success: true,
			data: {
				totalTimestamps: Number(totalResult?.count ?? 0),
				thisMonth: Number(monthResult?.count ?? 0),
				verifications: Number(verificationsResult?.count ?? 0),
				remaining: user.timestampsLimit - user.timestampsUsedThisMonth,
				limit: user.timestampsLimit,
				tier: user.subscriptionTier
			}
		}
	} catch (error) {
		console.error("Error in getDashboardStats:", error)
		return { success: false, error: "Failed to fetch stats" }
	}
}

/**
 * Get recent timestamps for the current user
 */
export async function getDashboardTimestamps(
	limit = 50
): Promise<ActionResult<DashboardTimestamp[]>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const userId = session.user.id

		const timestamps = await timestampRepository.findUserTimestampsWithPosts(
			userId,
			limit
		)

		// Get verification counts for each timestamp
		const timestampsWithCounts = await Promise.all(
			timestamps.map(async (ts) => {
				const verifications = await verificationRepository.findByTimestampId(
					ts.id
				)

				// Map status to UI status
				let uiStatus: "verified" | "pending" | "failed" = "pending"
				if (ts.status === "confirmed") uiStatus = "verified"
				else if (ts.status === "failed") uiStatus = "failed"

				// Calculate cost based on blockchain
				let cost = "Free"
				if (ts.blockchain === "ethereum") cost = "$2-5"
				else if (ts.blockchain === "polygon") cost = "$0.01"
				else if (ts.blockchain === "ethereum-sepolia") cost = "Testnet"

				return {
					id: ts.id,
					postUrl: ts.post?.xPostUrl ?? "",
					author: `@${ts.post?.authorUsername ?? "unknown"}`,
					content: ts.post?.content ?? "",
					timestampedAt: ts.createdAt.toISOString(),
					status: uiStatus,
					networks: [ts.blockchain],
					cost,
					verificationCount: verifications.length,
					transactionHash: ts.transactionHash,
					explorerUrl: ts.explorerUrl,
					otsProof: ts.otsProof
				}
			})
		)

		return { success: true, data: timestampsWithCounts }
	} catch (error) {
		console.error("Error in getDashboardTimestamps:", error)
		return { success: false, error: "Failed to fetch timestamps" }
	}
}

/**
 * Delete timestamps by IDs
 */
export async function deleteTimestamps(
	ids: string[]
): Promise<ActionResult<{ deleted: number }>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		// TODO: Implement actual deletion with ownership check
		// For now, just return success
		console.log("Would delete timestamps:", ids)

		return { success: true, data: { deleted: ids.length } }
	} catch (error) {
		console.error("Error in deleteTimestamps:", error)
		return { success: false, error: "Failed to delete timestamps" }
	}
}

/**
 * Export timestamps as JSON
 */
export async function exportTimestamps(
	ids: string[]
): Promise<ActionResult<{ data: string; filename: string }>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const userId = session.user.id

		// Get timestamps with posts
		const allTimestamps =
			await timestampRepository.findUserTimestampsWithPosts(userId)

		// Filter by IDs if provided
		const timestamps =
			ids.length > 0
				? allTimestamps.filter((ts) => ids.includes(ts.id))
				: allTimestamps

		const exportData = timestamps.map((ts) => ({
			id: ts.id,
			blockchain: ts.blockchain,
			status: ts.status,
			transactionHash: ts.transactionHash,
			blockNumber: ts.blockNumber,
			explorerUrl: ts.explorerUrl,
			createdAt: ts.createdAt.toISOString(),
			confirmedAt: ts.confirmedAt,
			post: ts.post
				? {
						xPostId: ts.post.xPostId,
						xPostUrl: ts.post.xPostUrl,
						author: ts.post.authorUsername,
						content: ts.post.content,
						contentHash: ts.post.contentHash,
						postedAt: ts.post.postedAt
					}
				: null
		}))

		return {
			success: true,
			data: {
				data: JSON.stringify(exportData, null, 2),
				filename: `saveonx-export-${new Date().toISOString().slice(0, 10)}.json`
			}
		}
	} catch (error) {
		console.error("Error in exportTimestamps:", error)
		return { success: false, error: "Failed to export timestamps" }
	}
}
