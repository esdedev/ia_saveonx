import { relations } from "drizzle-orm"
import {
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core"
import { dbIdSchema, isActive, createdAt, updatedAt } from "../schemaHelpers"
import { user } from "./auth"

// ============================================================================
// USER RELATIONS (user table is defined in auth.ts)
// ============================================================================
export const userRelations = relations(user, ({ many }) => ({
	posts: many(PostTable),
	timestamps: many(TimestampTable),
	contentVerifications: many(VerificationTable),
}))

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

// ============================================================================
// TIMESTAMPS TABLE - Blockchain timestamp records
// ============================================================================
export const TimestampTable = pgTable("timestamps", {
	id: dbIdSchema,
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	postId: uuid()
		.notNull()
		.references(() => PostTable.id, { onDelete: "cascade" }),

	// Blockchain info
	blockchain: varchar({ length: 50 }).notNull(), // ethereum, polygon, solana, etc.
	transactionHash: varchar({ length: 128 }),
	blockNumber: integer(),
	blockHash: varchar({ length: 128 }),

	// Timestamp data
	contentHash: varchar({ length: 128 }).notNull(), // Hash that was timestamped
	merkleRoot: varchar({ length: 128 }), // If using merkle trees

	// Status tracking
	status: varchar({ length: 20 }).notNull().default("pending"), // pending, processing, confirmed, failed
	confirmations: integer().default(0),
	errorMessage: text(),

	// Verification URL
	explorerUrl: text(), // Link to blockchain explorer

	// Cost tracking
	gasCost: varchar({ length: 50 }), // In wei/lamports/etc

	confirmedAt: varchar({ length: 50 }),
	createdAt,
	updatedAt
})

// ============================================================================
// TIMESTAMP RELATIONS
// ============================================================================
export const timestampRelations = relations(TimestampTable, ({ one }) => ({
	user: one(user, {
		fields: [TimestampTable.userId],
		references: [user.id],
	}),
	post: one(PostTable, {
		fields: [TimestampTable.postId],
		references: [PostTable.id],
	}),
}))

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
	verifiedAt: createdAt,
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

// ============================================================================
// API KEYS TABLE - For API access
// ============================================================================
export const ApiKeyTable = pgTable("api_keys", {
	id: dbIdSchema,
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	name: varchar({ length: 100 }).notNull(),
	keyHash: varchar({ length: 128 }).notNull().unique(), // Hashed API key
	keyPrefix: varchar({ length: 10 }).notNull(), // First chars for identification

	// Permissions
	permissions: text().default("read"), // JSON array: ["read", "write", "delete"]

	// Usage tracking
	lastUsedAt: varchar({ length: 50 }),
	usageCount: integer().default(0),

	// Expiration
	expiresAt: varchar({ length: 50 }),
	isActive,

	createdAt,
	updatedAt
})

// ============================================================================
// API KEY RELATIONS
// ============================================================================
export const apiKeyRelations = relations(ApiKeyTable, ({ one }) => ({
	user: one(user, {
		fields: [ApiKeyTable.userId],
		references: [user.id],
	}),
}))
