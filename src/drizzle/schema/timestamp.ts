import { relations } from "drizzle-orm"
import {
	customType,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core"
import { bytea } from "@/drizzle/schemaCustomTypes"
import { createdAt, dbIdSchema, updatedAt } from "../schemaHelpers"
import { PostTable } from "./post"
import { UserTable } from "@/drizzle/schema"

export const TransactionStatuses = ['pending', 'processing', 'confirmed', 'failed'] as const
export type TransactionStatus = (typeof TransactionStatuses)[number]
export const transactionStatusEnum = pgEnum('transaction_status', TransactionStatuses)

export const HashAlgorithms = ['sha256', 'sha512', 'keccak256', 'sha1'] as const
export type HashAlgorithm = (typeof HashAlgorithms)[number]
export const hashAlgorithmEnum = pgEnum('hash_algorithm', HashAlgorithms)

export const BlockchainNetworks = ['bitcoin-ots', 'ethereum', 'ethereum-sepolia', 'polygon'] as const
export type BlockchainNetwork = (typeof BlockchainNetworks)[number]
export const blockchainNetworkEnum = pgEnum('blockchain_network', BlockchainNetworks)

// ============================================================================
// TIMESTAMPS TABLE - Blockchain timestamp records
// ============================================================================
export const TimestampTable = pgTable("timestamps", {
	id: dbIdSchema,
	userId: text()
		.notNull()
		.references(() => UserTable.id, { onDelete: "cascade" }),
	postId: uuid()
		.notNull()
		.references(() => PostTable.id, { onDelete: "cascade" }),

	// Blockchain info
	blockchain: blockchainNetworkEnum().notNull(),
	transactionHash: varchar({ length: 128 }),
	blockNumber: integer(),
	blockHash: varchar({ length: 128 }),

	// Timestamp data
	contentHash: varchar({ length: 128 }).notNull(), // Hash that was timestamped
	hashAlgorithm: hashAlgorithmEnum().notNull(), // sha256, sha512, keccak256, etc.
	merkleRoot: varchar({ length: 128 }), // If using merkle trees

	// OpenTimestamps proof (Base64 encoded .ots file)
	// otsProof: text(), // The .ots proof file content
	otsBytes: bytea(), // The .ots proof file as bytes
	otsBitcoinBlock: varchar({ length: 100 }), // Bitcoin block number when confirmed
	otsTransactionHash: varchar({ length: 128 }), // Bitcoin transaction hash
	otsPending: integer().default(1), // 1 = pending Bitcoin confirmation, 0 = confirmed

	// Status tracking
	status: transactionStatusEnum().notNull().default("pending"), // pending, processing, confirmed, failed
	// confirmations: integer().default(0),
	errorMessage: text(),

	// Verification URL
	explorerUrl: text(), // Link to blockchain explorer

	// Cost tracking
	gasCost: varchar({ length: 50 }), // In wei/lamports/etc

	confirmedAt: timestamp({ withTimezone: true }),
	createdAt,
	updatedAt,
})

// ============================================================================
// TIMESTAMP RELATIONS
// ============================================================================
export const timestampRelations = relations(TimestampTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [TimestampTable.userId],
		references: [UserTable.id],
	}),
	post: one(PostTable, {
		fields: [TimestampTable.postId],
		references: [PostTable.id],
	}),
}))
