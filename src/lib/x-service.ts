/**
 * X/Twitter service for fetching and parsing posts
 * This is a mock implementation - in production, connect to X API
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
}

export interface ParsedPostUrl {
	isValid: boolean
	username?: string
	postId?: string
	originalUrl: string
	error?: string
}

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
 * Fetch post data from X/Twitter
 * MOCK IMPLEMENTATION - Replace with actual X API integration
 */
export async function fetchXPost(postUrl: string): Promise<XPostData | null> {
	const parsed = parseXPostUrl(postUrl)

	if (!parsed.isValid || !parsed.username || !parsed.postId) {
		return null
	}

	// TODO: Replace with actual X API call
	// For now, return mock data based on the URL
	const mockPost: XPostData = {
		postId: parsed.postId,
		postUrl: normalizeXPostUrl(parsed.username, parsed.postId),
		authorUsername: parsed.username,
		authorDisplayName:
			parsed.username.charAt(0).toUpperCase() + parsed.username.slice(1),
		authorProfileImage: `https://unavatar.io/twitter/${parsed.username}`,
		content: `This is a mock post content for @${parsed.username}. In production, this would be fetched from the X API. Post ID: ${parsed.postId}`,
		postedAt: new Date().toISOString(),
		likes: Math.floor(Math.random() * 1000),
		retweets: Math.floor(Math.random() * 500),
		replies: Math.floor(Math.random() * 100)
	}

	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500))

	return mockPost
}

/**
 * Check if a post still exists on X
 * MOCK IMPLEMENTATION
 */
export async function checkPostExists(postUrl: string): Promise<{
	exists: boolean
	currentContent?: string
	error?: string
}> {
	const parsed = parseXPostUrl(postUrl)

	if (!parsed.isValid) {
		return { exists: false, error: "Invalid URL" }
	}

	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 300))

	// TODO: Replace with actual X API call
	// Mock: randomly return exists/deleted for testing
	const mockExists = Math.random() > 0.1 // 90% chance post exists

	if (mockExists) {
		const mockContent = `Mock content for post ${parsed.postId}`
		return { exists: true, currentContent: mockContent }
	}

	return { exists: false, error: "Post not found or deleted" }
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
