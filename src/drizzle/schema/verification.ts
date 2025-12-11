import { relations } from "drizzle-orm"
import {
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core"
import { dbIdSchema, createdAt, updatedAt } from "../schemaHelpers"
import { user } from "./auth"
import { TimestampTable } from "./timestamp"

// ============================================================================
// VERIFICATIONS TABLE - Verification history
// ============================================================================
export const VerificationTable = pgTable("content_verifications", {
	id: dbIdSchema,
	userId: text().references(() => user.id), // Can be null for public verifications
	timestampId: uuid()
		.notNull()
		.references(() => TimestampTable.id, { onDelete: "cascade" }),

	// Verification request
	requestedPostUrl: text().notNull(),
	requestedContentHash: varchar({ length: 128 }).notNull(),

	// Verification result
	isVerified: varchar({ length: 10 }).notNull(), // "true", "false", "modified", "deleted"
	matchPercentage: integer(), // Content similarity percentage

	// Current state of post (at verification time)
	currentContent: text(),
	currentContentHash: varchar({ length: 128 }),
	isPostDeleted: varchar({ length: 5 }).default("false"), // "true" or "false"
	isPostModified: varchar({ length: 5 }).default("false"),

	// Metadata
	verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull().defaultNow(),
	ipAddress: varchar({ length: 50 }),
	userAgent: text(),

	createdAt,
	updatedAt
})

// ============================================================================
// CONTENT VERIFICATION RELATIONS
// ============================================================================
export const contentVerificationRelations = relations(
	VerificationTable,
	({ one }) => ({
		user: one(user, {
			fields: [VerificationTable.userId],
			references: [user.id],
		}),
		timestamp: one(TimestampTable, {
			fields: [VerificationTable.timestampId],
			references: [TimestampTable.id],
		}),
	})
)
