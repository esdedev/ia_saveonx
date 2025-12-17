import { relations } from "drizzle-orm"
import {
	integer,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core"
import { dbIdSchema, isActive, createdAt, updatedAt } from "../schemaHelpers"
import { UserTable } from "./user"

// ============================================================================
// API KEYS TABLE - For API access
// ============================================================================
export const ApiKeyTable = pgTable("api_keys", {
	id: dbIdSchema,
	userId: text()
		.notNull()
		.references(() => UserTable.id, { onDelete: "cascade" }),

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
	user: one(UserTable, {
		fields: [ApiKeyTable.userId],
		references: [UserTable.id],
	}),
}))
