import { relations } from "drizzle-orm"
import {
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"
import { dbIdSchema, createdAt, updatedAt } from "../schemaHelpers"
import { TimestampTable } from "./timestamp"
import { UserTable } from "@/drizzle/schema"

// ============================================================================
// POSTS TABLE - Captured X/Twitter posts
// ============================================================================
export const PostTable = pgTable("posts", {
	id: dbIdSchema,
	userId: text()
		.notNull()
		.references(() => UserTable.id, { onDelete: "cascade" }),

	// X/Twitter post data
	xPostId: varchar({ length: 50 }).notNull().unique(),
	xPostUrl: text().notNull(),
	authorUsername: varchar({ length: 50 }).notNull(),
	authorDisplayName: varchar({ length: 100 }),
	authorProfileImage: text(),

	// Post content (stored as snapshot)
	content: text().notNull(),
	contentHash: varchar({ length: 128 }).notNull(), // Hash of content

	// Engagement metrics at capture time
	likesAtCapture: integer().default(0),
	retweetsAtCapture: integer().default(0),
	repliesAtCapture: integer().default(0),

	// Post metadata
	postedAt: timestamp({ withTimezone: true })
		.notNull()
		.defaultNow(), // Original post timestamp from X

	createdAt,
	updatedAt,
})

// ============================================================================
// POST RELATIONS
// ============================================================================
export const postRelations = relations(PostTable, ({ one, many }) => ({
	user: one(UserTable, {
		fields: [PostTable.userId],
		references: [UserTable.id],
	}),
	timestamps: many(TimestampTable),
}))
