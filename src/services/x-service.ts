/**
 * X/Twitter service for fetching and parsing posts
 * Uses twitterapi.io for fetching tweet data
 */

export interface XPostData {
	postId: string
	postUrl: string
	authorUsername: string
	authorDisplayName: string
	authorProfileImage: string
	content: string
	postedAt: string
	likes: number
	retweets: number
	replies: number
	views?: number
	bookmarks?: number
	quotes?: number
}

// TwitterAPI.io response types
interface TwitterApiAuthor {
	userName: string
	name: string
	profilePicture: string
	id: string
	followers: number
	isVerified: boolean
	isBlueVerified: boolean
}

interface TwitterApiTweet {
	type: string
	id: string
	url: string
	twitterUrl: string
	text: string
	retweetCount: number
	replyCount: number
	likeCount: number
	quoteCount: number
	viewCount: number
	bookmarkCount: number
	createdAt: string
	lang: string
	author: TwitterApiAuthor
	isReply: boolean
	isRetweet: boolean
	isQuote: boolean
}

interface TwitterApiResponse {
	tweets: TwitterApiTweet[]
	status: string
	msg: string
	code: number
}

export interface ParsedPostUrl {
	isValid: boolean
	username?: string
	postId?: string
	originalUrl: string
	error?: string
}

const TWITTER_API_BASE_URL = "https://api.twitterapi.io/twitter"

/**
 * Parse X/Twitter post URL to extract username and post ID
 */
export function parseXPostUrl(url: string): ParsedPostUrl {
	const trimmedUrl = url.trim()

	// Match patterns:
	// https://x.com/username/status/123456789
	// https://twitter.com/username/status/123456789
	// x.com/username/status/123456789
	// twitter.com/username/status/123456789
	const patterns = [
		/^(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/i,
		/^(?:https?:\/\/)?(?:mobile\.)?(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/i
	]

	for (const pattern of patterns) {
		const match = trimmedUrl.match(pattern)
		if (match) {
			return {
				isValid: true,
				username: match[1],
				postId: match[2],
				originalUrl: trimmedUrl
			}
		}
	}

	return {
		isValid: false,
		originalUrl: trimmedUrl,
		error: "Invalid X/Twitter post URL"
	}
}

/**
 * Normalize X post URL to standard format
 */
export function normalizeXPostUrl(username: string, postId: string): string {
	return `https://x.com/${username}/status/${postId}`
}

/**
 * Fetch post data from X/Twitter using twitterapi.io
 * [MOCKED] TO USE JSON FILE IN MOCKS FOLDER
 */
export async function fetchXPost(postUrl: string): Promise<XPostData | null> {
	const parsed = parseXPostUrl(postUrl)

	if (!parsed.isValid || !parsed.username || !parsed.postId) {
		return null
	}

	const { username, postId } = parsed
	const apiKey = process.env.TWITTER_API_KEY

	if (!apiKey) {
		console.error("TWITTER_API_KEY is not configured")
		// Fall back to mock data in development
		if (process.env.NODE_ENV === "development") {
			return getMockPostData(username, postId)
		}
		return null
	}

	try {
		const response = await fetch(
			`${TWITTER_API_BASE_URL}/tweets?tweet_ids=${postId}`,
			{
				method: "GET",
				headers: {
					"X-API-Key": apiKey,
					"Content-Type": "application/json"
				}
			}
		)

		if (!response.ok) {
			console.error(
				`Twitter API error: ${response.status} ${response.statusText}`
			)
			return null
		}

		const data: TwitterApiResponse = await response.json()

		if (data.status !== "success" || !data.tweets || data.tweets.length === 0) {
			console.error("Tweet not found or API error:", data.msg)
			return null
		}

		const tweet = data.tweets[0]

		return {
			postId: tweet.id,
			postUrl: tweet.url || normalizeXPostUrl(tweet.author.userName, tweet.id),
			authorUsername: tweet.author.userName,
			authorDisplayName: tweet.author.name,
			authorProfileImage: tweet.author.profilePicture,
			content: tweet.text,
			postedAt: tweet.createdAt,
			likes: tweet.likeCount,
			retweets: tweet.retweetCount,
			replies: tweet.replyCount,
			views: tweet.viewCount,
			bookmarks: tweet.bookmarkCount,
			quotes: tweet.quoteCount
		}
	} catch (error) {
		console.error("Error fetching tweet:", error)
		return null
	}
}

/**
 * Get mock post data for development/testing
 */
function getMockPostData(username: string, postId: string): XPostData {
	return {
		postId: postId,
		postUrl: normalizeXPostUrl(username, postId),
		authorUsername: username,
		authorDisplayName: username.charAt(0).toUpperCase() + username.slice(1),
		authorProfileImage: `https://unavatar.io/twitter/${username}`,
		content: `[MOCK] This is a mock post content for @${username}. Configure TWITTER_API_KEY for real data. Post ID: ${postId}`,
		postedAt: new Date().toISOString(),
		likes: Math.floor(Math.random() * 1000),
		retweets: Math.floor(Math.random() * 500),
		replies: Math.floor(Math.random() * 100),
		views: Math.floor(Math.random() * 10000),
		bookmarks: Math.floor(Math.random() * 50),
		quotes: Math.floor(Math.random() * 20)
	}
}

/**
 * Check if a post still exists on X
 */
export async function checkPostExists(postUrl: string): Promise<{
	exists: boolean
	currentContent?: string
	error?: string
}> {
	const parsed = parseXPostUrl(postUrl)

	if (!parsed.isValid || !parsed.postId) {
		return { exists: false, error: "Invalid URL" }
	}

	const apiKey = process.env.TWITTER_API_KEY

	if (!apiKey) {
		// Fall back to mock in development
		if (process.env.NODE_ENV === "development") {
			const mockExists = Math.random() > 0.1
			if (mockExists) {
				return {
					exists: true,
					currentContent: `[MOCK] Content for post ${parsed.postId}`
				}
			}
			return { exists: false, error: "Post not found (mock)" }
		}
		return { exists: false, error: "API not configured" }
	}

	try {
		const response = await fetch(
			`${TWITTER_API_BASE_URL}/tweets?tweet_ids=${parsed.postId}`,
			{
				method: "GET",
				headers: {
					"X-API-Key": apiKey,
					"Content-Type": "application/json"
				}
			}
		)

		if (!response.ok) {
			return { exists: false, error: `API error: ${response.status}` }
		}

		const data: TwitterApiResponse = await response.json()

		if (data.status === "success" && data.tweets && data.tweets.length > 0) {
			return {
				exists: true,
				currentContent: data.tweets[0].text
			}
		}

		return { exists: false, error: "Post not found or deleted" }
	} catch (error) {
		console.error("Error checking post existence:", error)
		return { exists: false, error: "Failed to check post" }
	}
}

/**
 * Build embed URL for X post
 */
export function buildEmbedUrl(postUrl: string): string {
	const parsed = parseXPostUrl(postUrl)
	if (!parsed.isValid || !parsed.username || !parsed.postId) {
		return ""
	}
	return `https://platform.twitter.com/embed/Tweet.html?id=${parsed.postId}`
}
