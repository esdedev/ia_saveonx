/**
 * Crypto utilities for hashing and verification
 */

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * Converts an ArrayBuffer to a Hexadecimal String
 */
export function bufferToHex(buffer: ArrayBuffer): string {
  // Convert buffer to a byte array (Uint8Array)
  const byteArray = new Uint8Array(buffer);

  // Convert each byte to hex and join them
  // padStart(2, '0') ensures byte 5 becomes "05" and not "5"
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generic Hashing Function
 * Accepts strings, objects, or buffers.
 */
export async function genericHash(
  content: string | object | ArrayBuffer,
  algorithm: HashAlgorithm = "SHA-256"
): Promise<string> {
  let data: BufferSource;

  // 1. Normalize input to bytes
  if (typeof content === "string") {
    const encoder = new TextEncoder();
    data = encoder.encode(content);
  } else if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
    data = content as BufferSource;
  } else {
    // If it's an object/array, convert to JSON string first
    const encoder = new TextEncoder();
    data = encoder.encode(JSON.stringify(content));
  }

  // 2. Hash Generation (raw buffer)
  const hashBuffer = await crypto.subtle.digest(algorithm, data);

  // 3. Convert to Hexadecimal (most useful format)
  return bufferToHex(hashBuffer);
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
	const currentHash = await genericHash(currentContent, "SHA-256")
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
