// Shared post content type used across timestamp, verify, and marketing features
export interface PostContent {
	author: string
	handle: string
	content: string
	timestamp: string
	likes: number
	retweets: number
	replies: number
	profileImage?: string
}

// Common status types
export type StatusVariant = "verified" | "pending" | "failed"

// Accent color types used across features
export type AccentColor = "blue" | "purple" | "green" | "yellow" | "orange"

// Badge semantic variants
export type BadgeVariant =
	| "success"
	| "warning"
	| "error"
	| "info"
	| "purple"
	| "orange"
	| "neutral"

// Icon identifiers for serializable icon references
export type IconName =
	| "arrowRight"
	| "search"
	| "checkCircle"
	| "shield"
	| "zap"
	| "clock"
	| "users"
	| "xCircle"
	| "alertCircle"
	| "twitter"
	| "link"
	| "copy"
	| "download"
	| "share"
	| "settings"
	| "bell"
	| "key"
	| "creditCard"
	| "user"
	| "chevronLeft"
	| "chevronRight"
	| "plus"
	| "trash"
	| "edit"
	| "eye"
	| "eyeOff"
	| "externalLink"
	| "menu"
	| "x"
	| "check"
	| "loader"
	| "refresh"
