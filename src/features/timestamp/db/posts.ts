import { desc, eq } from "drizzle-orm"
import { db } from "@/drizzle/db"
import type { NewPost, Post } from "@/drizzle/schema/types"
import { PostTable } from "@/drizzle/schema/post"

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
