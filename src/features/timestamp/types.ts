export type TimestampStep = "input" | "preview" | "networks" | "confirmation"

export interface PostPreview {
	author: string
	handle: string
	content: string
	timestamp: string
	likes: number
	retweets: number
	replies: number
	profileImage?: string
}

export type SecurityLevel = "high" | "medium" | "low"

export interface BlockchainOption {
	id: string
	name: string
	icon: string
	cost: string
	speed: string
	confirmation: string
	security: SecurityLevel
	recommended?: boolean
	description?: string
}

export interface SubmissionResult {
	transactionId: string
	hash: string
}
