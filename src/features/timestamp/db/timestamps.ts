import { and, desc, eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import type { NewTimestamp, Timestamp, TimestampUpdate } from "@/drizzle/schema/types"
import { TimestampTable } from "@/drizzle/schema/timestamp"

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

	async findPendingOTS(): Promise<Timestamp[]> {
		return db.query.TimestampTable.findMany({
			where: and(
				eq(TimestampTable.blockchain, "bitcoin-ots"),
				eq(TimestampTable.otsPending, 1)
			),
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
