export type TimestampStatus = "verified" | "pending" | "failed"

export type FilterStatus = "all" | TimestampStatus

export interface TimestampRecord {
	id: string
	postUrl: string
	author: string
	content: string
	timestampedAt: string
	status: TimestampStatus
	networks: string[]
	cost: string
	verificationCount: number
}

export interface UserStats {
	totalTimestamps: number
	thisMonth: number
	verifications: number
	savedCosts: string
}
