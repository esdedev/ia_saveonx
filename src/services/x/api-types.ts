// --- Sub-entidades (URLs, Hashtags, Menciones) ---

export interface XEntityUrl {
	display_url: string
	expanded_url: string
	indices: number[]
	url: string
}

export interface XEntityHashtag {
	indices: number[]
	text: string
}

export interface XEntityUserMention {
	id_str: string
	name: string
	screen_name: string
}

export interface XPostEntities {
	hashtags?: XEntityHashtag[]
	urls?: XEntityUrl[]
	user_mentions?: XEntityUserMention[]
}

// --- Perfil del Usuario (XUser) ---

export interface XUserProfileBioEntities {
	description?: {
		urls: XEntityUrl[]
	}
	url?: {
		urls: XEntityUrl[]
	}
}

export interface XUserProfileBio {
	description?: string
	entities?: XUserProfileBioEntities
}

export interface XUser {
	type: "user" // La API sigue devolviendo "user"
	userName: string
	url: string
	id: string
	name: string
	isBlueVerified: boolean
	verifiedType: string
	profilePicture: string
	coverPicture: string
	description: string
	location: string
	followers: number
	following: number
	canDm: boolean
	createdAt: string
	favouritesCount: number
	hasCustomTimelines: boolean
	isTranslator: boolean
	mediaCount: number
	statusesCount: number
	withheldInCountries: string[]
	affiliatesHighlightedLabel: Record<string, unknown>
	possiblySensitive: boolean
	pinnedTweetIds: string[]
	isAutomated: boolean
	automatedBy: string | null
	unavailable: boolean
	message?: string
	unavailableReason?: string
	profile_bio?: XUserProfileBio
}

// --- El Post Principal (XPost) ---

export interface XPost {
	type: "tweet" // La API devuelve "tweet" aunque lo llamemos Post
	id: string
	url: string
	text: string
	source: string
	retweetCount: number
	replyCount: number
	likeCount: number
	quoteCount: number
	viewCount: number
	createdAt: string
	lang: string
	bookmarkCount: number
	isReply: boolean
	inReplyToId?: string
	conversationId?: string
	displayTextRange?: number[]
	inReplyToUserId?: string
	inReplyToUsername?: string
	author?: XUser
	entities?: XPostEntities
	isLimitedReply?: boolean

	// Recursividad: Un post cita o repostea a otro XPost
	quoted_tweet?: XPost | null
	retweeted_tweet?: XPost | null
}

// --- Respuesta de la API ---

export interface XApiResponse {
	tweets: XPost[] // La API devuelve la key "tweets"
	status: string
	message?: string
}
