import { relations } from "drizzle-orm"
import { user } from "./auth"
import { PostTable } from "./post"
import { TimestampTable } from "./timestamp"
import { VerificationTable } from "./verification"

// ============================================================================
// USER RELATIONS (user table is defined in auth.ts)
// ============================================================================
export const userRelations = relations(user, ({ many }) => ({
	posts: many(PostTable),
	timestamps: many(TimestampTable),
	contentVerifications: many(VerificationTable),
}))
