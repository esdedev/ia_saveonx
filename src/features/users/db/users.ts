import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "@/drizzle/db"
import type { NewUser, User, UserUpdate } from "@/drizzle/schema"
import { user } from "@/drizzle/schema/auth"

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
