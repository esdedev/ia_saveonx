import { desc, eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import type { NewVerification, Verification } from "@/drizzle/schema/types"
import { ContentVerificationTable } from "@/drizzle/schema/verification"

// ============================================================================
// VERIFICATION REPOSITORY
// ============================================================================

export const verificationRepository = {
	async create(data: NewVerification): Promise<Verification> {
		const [verification] = await db
			.insert(ContentVerificationTable)
			.values(data)
			.returning()
		return verification
	},

	async findById(id: string): Promise<Verification | undefined> {
		return db.query.ContentVerificationTable.findFirst({
			where: eq(ContentVerificationTable.id, id)
		})
	},

	async findByTimestampId(timestampId: string): Promise<Verification[]> {
		return db.query.ContentVerificationTable.findMany({
			where: eq(ContentVerificationTable.timestampId, timestampId),
			orderBy: desc(ContentVerificationTable.createdAt)
		})
	},

	async findByUserId(userId: string, limit = 50): Promise<Verification[]> {
		return db.query.ContentVerificationTable.findMany({
			where: eq(ContentVerificationTable.userId, userId),
			orderBy: desc(ContentVerificationTable.createdAt),
			limit
		})
	},

	async findWithTimestamp(id: string) {
		return db.query.ContentVerificationTable.findFirst({
			where: eq(ContentVerificationTable.id, id),
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
		return db.query.ContentVerificationTable.findMany({
			orderBy: desc(ContentVerificationTable.createdAt),
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
