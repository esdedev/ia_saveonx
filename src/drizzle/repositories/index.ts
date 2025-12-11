import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "../db"
import type {
	ApiKey,
	NewApiKey,
	NewPost,
	NewTimestamp,
	NewUser,
	NewVerification,
	Post,
	Timestamp,
	TimestampUpdate,
	User,
	UserUpdate,
	Verification,
} from "../schema"
import {
	ApiKeyTable,
	PostTable,
	TimestampTable,
	VerificationTable,
} from "../schema"
import { user } from "../schema/auth"

// ============================================================================
// USER REPOSITORY
// Note: User creation is handled by better-auth.
// This repository is for app-specific user operations.
// ============================================================================
export const userRepository = {
	async findById(id: string): Promise<User | undefined> {
		return db.query.user.findFirst({
			where: eq(user.id, id),
		})
	},

	async findByEmail(email: string): Promise<User | undefined> {
		return db.query.user.findFirst({
			where: eq(user.email, email),
		})
	},

	async update(id: string, data: UserUpdate): Promise<User | undefined> {
		const [updated] = await db
			.update(user)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(user.id, id))
			.returning()
		return updated
	},

	async incrementTimestampsUsed(id: string): Promise<void> {
		await db
			.update(user)
			.set({
				timestampsUsedThisMonth: sql`${user.timestampsUsedThisMonth} + 1`,
			})
			.where(eq(user.id, id))
	},

	async resetMonthlyUsage(id: string): Promise<void> {
		await db
			.update(user)
			.set({ timestampsUsedThisMonth: 0 })
			.where(eq(user.id, id))
	},

	async delete(id: string): Promise<void> {
		await db.delete(user).where(eq(user.id, id))
	},
}

// ============================================================================
// POST REPOSITORY
// ============================================================================
export const postRepository = {
	async create(data: NewPost): Promise<Post> {
		const [post] = await db.insert(PostTable).values(data).returning()
		return post
	},

	async findById(id: string): Promise<Post | undefined> {
		return db.query.PostTable.findFirst({
			where: eq(PostTable.id, id)
		})
	},

	async findByXPostId(xPostId: string): Promise<Post | undefined> {
		return db.query.PostTable.findFirst({
			where: eq(PostTable.xPostId, xPostId)
		})
	},

	async findByContentHash(contentHash: string): Promise<Post | undefined> {
		return db.query.PostTable.findFirst({
			where: eq(PostTable.contentHash, contentHash)
		})
	},

	async findByUserId(userId: string, limit = 50): Promise<Post[]> {
		return db.query.PostTable.findMany({
			where: eq(PostTable.userId, userId),
			orderBy: desc(PostTable.createdAt),
			limit
		})
	},

	async findWithTimestamps(postId: string) {
		return db.query.PostTable.findFirst({
			where: eq(PostTable.id, postId),
			with: {
				timestamps: true
			}
		})
	},

	async delete(id: string): Promise<void> {
		await db.delete(PostTable).where(eq(PostTable.id, id))
	}
}

// ============================================================================
// TIMESTAMP REPOSITORY
// ============================================================================
export const timestampRepository = {
	async create(data: NewTimestamp): Promise<Timestamp> {
		const [timestamp] = await db.insert(TimestampTable).values(data).returning()
		return timestamp
	},

	async findById(id: string): Promise<Timestamp | undefined> {
		return db.query.TimestampTable.findFirst({
			where: eq(TimestampTable.id, id)
		})
	},

	async findByPostId(postId: string): Promise<Timestamp[]> {
		return db.query.TimestampTable.findMany({
			where: eq(TimestampTable.postId, postId),
			orderBy: desc(TimestampTable.createdAt)
		})
	},

	async findByUserId(userId: string, limit = 50): Promise<Timestamp[]> {
		return db.query.TimestampTable.findMany({
			where: eq(TimestampTable.userId, userId),
			orderBy: desc(TimestampTable.createdAt),
			limit
		})
	},

	async findByTransactionHash(txHash: string): Promise<Timestamp | undefined> {
		return db.query.TimestampTable.findFirst({
			where: eq(TimestampTable.transactionHash, txHash)
		})
	},

	async findPending(): Promise<Timestamp[]> {
		return db.query.TimestampTable.findMany({
			where: eq(TimestampTable.status, "pending"),
			orderBy: desc(TimestampTable.createdAt)
		})
	},

	async update(
		id: string,
		data: TimestampUpdate
	): Promise<Timestamp | undefined> {
		const [timestamp] = await db
			.update(TimestampTable)
			.set(data)
			.where(eq(TimestampTable.id, id))
			.returning()
		return timestamp
	},

	async updateStatus(
		id: string,
		status: string,
		errorMessage?: string
	): Promise<void> {
		await db
			.update(TimestampTable)
			.set({
				status,
				errorMessage,
				confirmedAt:
					status === "confirmed" ? new Date().toISOString() : undefined
			})
			.where(eq(TimestampTable.id, id))
	},

	async findWithPost(id: string) {
		return db.query.TimestampTable.findFirst({
			where: eq(TimestampTable.id, id),
			with: {
				post: true
			}
		})
	},

	async findUserTimestampsWithPosts(userId: string, limit = 50) {
		return db.query.TimestampTable.findMany({
			where: eq(TimestampTable.userId, userId),
			with: {
				post: true
			},
			orderBy: desc(TimestampTable.createdAt),
			limit
		})
	}
}

// ============================================================================
// VERIFICATION REPOSITORY
// ============================================================================
export const verificationRepository = {
	async create(data: NewVerification): Promise<Verification> {
		const [verification] = await db
			.insert(VerificationTable)
			.values(data)
			.returning()
		return verification
	},

	async findById(id: string): Promise<Verification | undefined> {
		return db.query.VerificationTable.findFirst({
			where: eq(VerificationTable.id, id)
		})
	},

	async findByTimestampId(timestampId: string): Promise<Verification[]> {
		return db.query.VerificationTable.findMany({
			where: eq(VerificationTable.timestampId, timestampId),
			orderBy: desc(VerificationTable.createdAt)
		})
	},

	async findByUserId(userId: string, limit = 50): Promise<Verification[]> {
		return db.query.VerificationTable.findMany({
			where: eq(VerificationTable.userId, userId),
			orderBy: desc(VerificationTable.createdAt),
			limit
		})
	},

	async findWithTimestamp(id: string) {
		return db.query.VerificationTable.findFirst({
			where: eq(VerificationTable.id, id),
			with: {
				timestamp: {
					with: {
						post: true
					}
				}
			}
		})
	},

	async getRecentPublicVerifications(limit = 10) {
		return db.query.VerificationTable.findMany({
			orderBy: desc(VerificationTable.createdAt),
			limit,
			with: {
				timestamp: {
					with: {
						post: true
					}
				}
			}
		})
	}
}

// ============================================================================
// API KEY REPOSITORY
// ============================================================================
export const apiKeyRepository = {
	async create(data: NewApiKey): Promise<ApiKey> {
		const [apiKey] = await db.insert(ApiKeyTable).values(data).returning()
		return apiKey
	},

	async findByKeyHash(keyHash: string): Promise<ApiKey | undefined> {
		return db.query.ApiKeyTable.findFirst({
			where: and(
				eq(ApiKeyTable.keyHash, keyHash),
				eq(ApiKeyTable.isActive, true)
			)
		})
	},

	async findByUserId(userId: string): Promise<ApiKey[]> {
		return db.query.ApiKeyTable.findMany({
			where: eq(ApiKeyTable.userId, userId),
			orderBy: desc(ApiKeyTable.createdAt)
		})
	},

	async updateLastUsed(id: string): Promise<void> {
		await db
			.update(ApiKeyTable)
			.set({
				lastUsedAt: new Date().toISOString(),
				usageCount: sql`${ApiKeyTable.usageCount} + 1`
			})
			.where(eq(ApiKeyTable.id, id))
	},

	async deactivate(id: string): Promise<void> {
		await db
			.update(ApiKeyTable)
			.set({ isActive: false })
			.where(eq(ApiKeyTable.id, id))
	},

	async delete(id: string): Promise<void> {
		await db.delete(ApiKeyTable).where(eq(ApiKeyTable.id, id))
	}
}
