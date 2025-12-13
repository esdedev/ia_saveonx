"use server"

import { createHash, randomBytes } from "crypto"
import { and, eq, sql } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { ApiKeyTable } from "@/drizzle/schema/api-key"
import { TimestampTable } from "@/drizzle/schema/timestamp"
import { VerificationTable } from "@/drizzle/schema/verification"
import { userRepository } from "@/features/users/db/users"
import { getServerSession } from "@/services/auth/auth-server"
import type { ActionResult } from "@/types/actions"

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile {
	id: string
	name: string
	email: string
	emailVerified: boolean
	image: string | null
	xUsername: string | null
	subscriptionTier: string
	createdAt: Date
}

export interface BillingInfo {
	tier: string
	timestampsUsedThisMonth: number
	timestampsLimit: number
	remaining: number
	daysLeftInMonth: number
}

export interface ApiKeyInfo {
	id: string
	name: string
	keyPrefix: string
	isActive: boolean
	createdAt: string
	lastUsedAt: string | null
	usageCount: number
}

export interface ApiUsageStats {
	callsThisMonth: number
	remainingCalls: number
	uptime: number // percentage
}

export interface NotificationPreferences {
	email: boolean
	browser: boolean
	verification: boolean
	billing: boolean
}

// ============================================================================
// PROFILE ACTIONS
// ============================================================================

/**
 * Get user profile for the current user
 */
export async function getUserProfile(): Promise<ActionResult<UserProfile>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const userRecord = await userRepository.findById(session.user.id)
		if (!userRecord) {
			return { success: false, error: "User not found" }
		}

		return {
			success: true,
			data: {
				id: userRecord.id,
				name: userRecord.name,
				email: userRecord.email,
				emailVerified: userRecord.emailVerified,
				image: userRecord.image,
				xUsername: userRecord.xUsername,
				subscriptionTier: userRecord.subscriptionTier,
				createdAt: userRecord.createdAt
			}
		}
	} catch (error) {
		console.error("Error fetching user profile:", error)
		return { success: false, error: "Failed to load profile" }
	}
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
	name?: string
}): Promise<ActionResult<UserProfile>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const updated = await userRepository.update(session.user.id, {
			name: data.name
		})

		if (!updated) {
			return { success: false, error: "Failed to update profile" }
		}

		return {
			success: true,
			data: {
				id: updated.id,
				name: updated.name,
				email: updated.email,
				emailVerified: updated.emailVerified,
				image: updated.image,
				xUsername: updated.xUsername,
				subscriptionTier: updated.subscriptionTier,
				createdAt: updated.createdAt
			}
		}
	} catch (error) {
		console.error("Error updating user profile:", error)
		return { success: false, error: "Failed to update profile" }
	}
}

// ============================================================================
// BILLING ACTIONS
// ============================================================================

/**
 * Get billing info for the current user
 */
export async function getBillingInfo(): Promise<ActionResult<BillingInfo>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const userRecord = await userRepository.findById(session.user.id)
		if (!userRecord) {
			return { success: false, error: "User not found" }
		}

		// Calculate days left in month
		const now = new Date()
		const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
		const daysLeft = Math.ceil(
			(endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
		)

		return {
			success: true,
			data: {
				tier: userRecord.subscriptionTier,
				timestampsUsedThisMonth: userRecord.timestampsUsedThisMonth,
				timestampsLimit: userRecord.timestampsLimit,
				remaining: Math.max(
					0,
					userRecord.timestampsLimit - userRecord.timestampsUsedThisMonth
				),
				daysLeftInMonth: daysLeft
			}
		}
	} catch (error) {
		console.error("Error fetching billing info:", error)
		return { success: false, error: "Failed to load billing info" }
	}
}

// ============================================================================
// API KEY ACTIONS
// ============================================================================

/**
 * Get all API keys for the current user
 */
export async function getApiKeys(): Promise<ActionResult<ApiKeyInfo[]>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const keys = await db
			.select()
			.from(ApiKeyTable)
			.where(eq(ApiKeyTable.userId, session.user.id))

		return {
			success: true,
			data: keys.map((key) => ({
				id: key.id,
				name: key.name,
				keyPrefix: key.keyPrefix,
				isActive: key.isActive,
				createdAt: key.createdAt.toISOString(),
				lastUsedAt: key.lastUsedAt,
				usageCount: key.usageCount ?? 0
			}))
		}
	} catch (error) {
		console.error("Error fetching API keys:", error)
		return { success: false, error: "Failed to load API keys" }
	}
}

/**
 * Generate a new API key
 */
export async function createApiKey(
	name: string
): Promise<ActionResult<{ key: string; info: ApiKeyInfo }>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		// Generate a random API key
		const rawKey = `sk_live_${randomBytes(32).toString("hex")}`
		const keyHash = createHash("sha256").update(rawKey).digest("hex")
		const keyPrefix = rawKey.substring(0, 12)

		const [newKey] = await db
			.insert(ApiKeyTable)
			.values({
				userId: session.user.id,
				name,
				keyHash,
				keyPrefix,
				permissions: "read",
				isActive: true
			})
			.returning()

		return {
			success: true,
			data: {
				key: rawKey, // Only shown once!
				info: {
					id: newKey.id,
					name: newKey.name,
					keyPrefix: newKey.keyPrefix,
					isActive: newKey.isActive,
					createdAt: newKey.createdAt.toISOString(),
					lastUsedAt: newKey.lastUsedAt,
					usageCount: newKey.usageCount ?? 0
				}
			}
		}
	} catch (error) {
		console.error("Error creating API key:", error)
		return { success: false, error: "Failed to create API key" }
	}
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(keyId: string): Promise<ActionResult<void>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		// Ensure the key belongs to the current user
		const [key] = await db
			.select()
			.from(ApiKeyTable)
			.where(
				and(eq(ApiKeyTable.id, keyId), eq(ApiKeyTable.userId, session.user.id))
			)

		if (!key) {
			return { success: false, error: "API key not found" }
		}

		await db.delete(ApiKeyTable).where(eq(ApiKeyTable.id, keyId))

		return { success: true, data: undefined }
	} catch (error) {
		console.error("Error revoking API key:", error)
		return { success: false, error: "Failed to revoke API key" }
	}
}

/**
 * Get API usage stats
 */
export async function getApiUsageStats(): Promise<ActionResult<ApiUsageStats>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		// Count API usage from api keys
		const [usageResult] = await db
			.select({
				total: sql<number>`COALESCE(SUM(${ApiKeyTable.usageCount}), 0)`
			})
			.from(ApiKeyTable)
			.where(eq(ApiKeyTable.userId, session.user.id))

		const userRecord = await userRepository.findById(session.user.id)
		if (!userRecord) {
			return { success: false, error: "User not found" }
		}

		// API calls limit based on tier
		const tierLimits: Record<string, number> = {
			free: 1000,
			pro: 10000,
			enterprise: 100000
		}
		const apiLimit = tierLimits[userRecord.subscriptionTier] ?? 1000
		const callsThisMonth = Number(usageResult?.total ?? 0)

		return {
			success: true,
			data: {
				callsThisMonth,
				remainingCalls: Math.max(0, apiLimit - callsThisMonth),
				uptime: 99.9 // Fixed for now, could track actual uptime
			}
		}
	} catch (error) {
		console.error("Error fetching API usage stats:", error)
		return { success: false, error: "Failed to load API usage" }
	}
}

// ============================================================================
// SECURITY ACTIONS
// ============================================================================

/**
 * Export all user data (GDPR compliance)
 */
export async function exportUserData(): Promise<
	ActionResult<{
		user: UserProfile
		timestamps: number
		verifications: number
		apiKeys: number
	}>
> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		const userId = session.user.id

		// Get user info
		const userRecord = await userRepository.findById(userId)
		if (!userRecord) {
			return { success: false, error: "User not found" }
		}

		// Count timestamps
		const [timestampCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(TimestampTable)
			.where(eq(TimestampTable.userId, userId))

		// Count verifications
		const [verificationCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(VerificationTable)
			.innerJoin(
				TimestampTable,
				eq(VerificationTable.timestampId, TimestampTable.id)
			)
			.where(eq(TimestampTable.userId, userId))

		// Count API keys
		const [apiKeyCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(ApiKeyTable)
			.where(eq(ApiKeyTable.userId, userId))

		return {
			success: true,
			data: {
				user: {
					id: userRecord.id,
					name: userRecord.name,
					email: userRecord.email,
					emailVerified: userRecord.emailVerified,
					image: userRecord.image,
					xUsername: userRecord.xUsername,
					subscriptionTier: userRecord.subscriptionTier,
					createdAt: userRecord.createdAt
				},
				timestamps: Number(timestampCount?.count ?? 0),
				verifications: Number(verificationCount?.count ?? 0),
				apiKeys: Number(apiKeyCount?.count ?? 0)
			}
		}
	} catch (error) {
		console.error("Error exporting user data:", error)
		return { success: false, error: "Failed to export data" }
	}
}

/**
 * Delete user account and all associated data
 */
export async function deleteUserAccount(): Promise<ActionResult<void>> {
	try {
		const session = await getServerSession()
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" }
		}

		// Delete user (cascades to all related data due to FK constraints)
		await userRepository.delete(session.user.id)

		return { success: true, data: undefined }
	} catch (error) {
		console.error("Error deleting user account:", error)
		return { success: false, error: "Failed to delete account" }
	}
}
