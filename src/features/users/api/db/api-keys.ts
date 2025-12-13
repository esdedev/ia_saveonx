import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "@/drizzle/db"
import type { ApiKey, NewApiKey } from "@/drizzle/schema/types"
import { ApiKeyTable } from "@/drizzle/schema/api-key"

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
