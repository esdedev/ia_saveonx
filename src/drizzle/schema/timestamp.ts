import { relations } from "drizzle-orm"
import {
	integer,
	pgTable,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core"
import { dbIdSchema, createdAt, updatedAt } from "../schemaHelpers"
import { user } from "./auth"
import { PostTable } from "./post"

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
