import { PostTable, TimestampTable, ContentVerificationTable } from "@/drizzle/schema"
import { relations } from "drizzle-orm"
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core"

export const userSubscriptionTier = ['free', 'pro', 'enterprise'] as const
export type UserSubscriptionTier = (typeof userSubscriptionTier)[number]
export const userSubscriptionTierEnum = pgEnum('user_subscription_tier', userSubscriptionTier)

// ============================================================================
// BETTER-AUTH TABLES
// These tables are managed by better-auth for authentication
// Extended with app-specific user fields
// ============================================================================

export const UserTable = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),

	// Role management (for admin plugin)
	role: text("role").default("user"),
	banned: boolean("banned").default(false),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires"),

	// Subscription info
	subscriptionTier: userSubscriptionTierEnum().notNull().default("free"), // free, pro, enterprise
	timestampsUsedThisMonth: integer("timestamps_used_this_month")
		.notNull()
		.default(0),
	timestampsLimit: integer("timestamps_limit").notNull().default(10), // Free tier: 10/month
})

export const SessionTable = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => UserTable.id, { onDelete: "cascade" }),
		impersonatedBy: text("impersonated_by"),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
)

export const AccountTable = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => UserTable.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
)

export const VerificationTable = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
)

export const userRelations = relations(UserTable, ({ many }) => ({
	posts: many(PostTable),
	timestamps: many(TimestampTable),
	contentVerifications: many(VerificationTable),
}))



