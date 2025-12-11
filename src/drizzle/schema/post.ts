import { relations } from "drizzle-orm"
import {
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"
import { dbIdSchema, createdAt, updatedAt } from "../schemaHelpers"
import { user } from "./auth"
import { TimestampTable } from "./timestamp"

// ============================================================================
// POSTS TABLE - Captured X/Twitter posts
// ============================================================================
export const PostTable = pgTable("posts", {
	id: dbIdSchema,
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	// X/Twitter post data
	xPostId: varchar({ length: 50 }).notNull().unique(),
	xPostUrl: text().notNull(),
	authorUsername: varchar({ length: 50 }).notNull(),
	authorDisplayName: varchar({ length: 100 }),
	authorProfileImage: text(),

	// Post content (stored as snapshot)
	content: text().notNull(),
	contentHash: varchar({ length: 128 }).notNull(), // SHA-512 hash of content

	// Engagement metrics at capture time
	likesAtCapture: integer().default(0),
	retweetsAtCapture: integer().default(0),
	repliesAtCapture: integer().default(0),

	// Post metadata
	postedAt: varchar({ length: 50 }), // Original post timestamp from X
	capturedAt: timestamp("captured_at", { withTimezone: true })
		.notNull()
		.defaultNow(),

	createdAt,
	updatedAt,
})

// ============================================================================
// POST RELATIONS
// ============================================================================
export const postRelations = relations(PostTable, ({ one, many }) => ({
	user: one(user, {
		fields: [PostTable.userId],
		references: [user.id],
	}),
	timestamps: many(TimestampTable),
}))
