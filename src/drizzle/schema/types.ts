import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { ApiKeyTable } from "./api-key"
import { PostTable } from "./post"
import { TimestampTable } from "./timestamp"
import { ContentVerificationTable } from "./verification"

// ============================================================================
// POST TYPES
// ============================================================================
export type Post = InferSelectModel<typeof PostTable>
export type NewPost = InferInsertModel<typeof PostTable>
export type PostUpdate = Partial<Omit<NewPost, "id" | "createdAt">>

// ============================================================================
// TIMESTAMP TYPES
// ============================================================================
export type Timestamp = InferSelectModel<typeof TimestampTable>
export type NewTimestamp = InferInsertModel<typeof TimestampTable>
export type TimestampUpdate = Partial<Omit<NewTimestamp, "id" | "createdAt">>

export type TimestampStatus = "pending" | "processing" | "confirmed" | "failed"

// ============================================================================
// VERIFICATION TYPES
// ============================================================================
export type Verification = InferSelectModel<typeof ContentVerificationTable>
export type NewVerification = InferInsertModel<typeof ContentVerificationTable>

export type VerificationResult = "true" | "false" | "modified" | "deleted"

// ============================================================================
// API KEY TYPES
// ============================================================================
export type ApiKey = InferSelectModel<typeof ApiKeyTable>
export type NewApiKey = InferInsertModel<typeof ApiKeyTable>

export type ApiKeyPermission = "read" | "write" | "delete"

// ============================================================================
// COMBINED TYPES (with relations)
// ============================================================================
export type PostWithTimestamps = Post & {
	timestamps: Timestamp[]
}

export type TimestampWithPost = Timestamp & {
	post: Post
}

// export type UserWithPosts = User & {
// 	posts: Post[]
// }

export type VerificationWithTimestamp = Verification & {
	timestamp: TimestampWithPost
}
