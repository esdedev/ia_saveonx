/**
 * Crypto utilities for hashing and verification
 */

/**
 * Generate SHA-512 hash of content
 */
export async function hashContent(content: string): Promise<string> {
	const encoder = new TextEncoder()
	const data = encoder.encode(content)
	const hashBuffer = await crypto.subtle.digest("SHA-512", data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * Generate SHA-256 hash (shorter, for API keys etc.)
 */
export async function hashSHA256(content: string): Promise<string> {
	const encoder = new TextEncoder()
	const data = encoder.encode(content)
	const hashBuffer = await crypto.subtle.digest("SHA-256", data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * Generate a random API key
 */
export function generateApiKey(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	const keyLength = 32
	let key = "sox_" // SaveOnX prefix
	for (let i = 0; i < keyLength; i++) {
		key += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return key
}

/**
 * Get prefix from API key for identification
 */
export function getApiKeyPrefix(key: string): string {
	return key.substring(0, 10)
}

/**
 * Verify content hasn't been modified by comparing hashes
 */
export async function verifyContentIntegrity(
	originalHash: string,
	currentContent: string
): Promise<boolean> {
	const currentHash = await hashContent(currentContent)
	return originalHash === currentHash
}

/**
 * Calculate similarity percentage between two strings
 * Uses Levenshtein distance
 */
export function calculateSimilarity(str1: string, str2: string): number {
	if (str1 === str2) return 100
	if (str1.length === 0 || str2.length === 0) return 0

	const matrix: number[][] = []

	for (let i = 0; i <= str1.length; i++) {
		matrix[i] = [i]
	}

	for (let j = 0; j <= str2.length; j++) {
		matrix[0][j] = j
	}

	for (let i = 1; i <= str1.length; i++) {
		for (let j = 1; j <= str2.length; j++) {
			const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1,
				matrix[i - 1][j - 1] + cost
			)
		}
	}

	const maxLength = Math.max(str1.length, str2.length)
	const distance = matrix[str1.length][str2.length]
	return Math.round(((maxLength - distance) / maxLength) * 100)
}
