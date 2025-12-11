import { desc, eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import type { NewVerification, Verification } from "@/drizzle/schema/types"
import { VerificationTable } from "@/drizzle/schema/verification"

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
