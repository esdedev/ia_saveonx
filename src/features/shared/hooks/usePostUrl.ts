"use client"

import { useCallback, useState } from "react"

// Common X/Twitter URL patterns
const URL_PATTERNS = {
	x: /^https?:\/\/(www\.)?x\.com\/(\w+)\/status\/(\d+)/,
	twitter: /^https?:\/\/(www\.)?twitter\.com\/(\w+)\/status\/(\d+)/,
	short: /^(x\.com|twitter\.com)\/(\w+)\/status\/(\d+)/
} as const

interface ParsedPostUrl {
	isValid: boolean
	platform: "x" | "twitter" | null
	username: string | null
	postId: string | null
	normalizedUrl: string | null
}

/**
 * Parse and validate an X/Twitter post URL.
 */
export function parsePostUrl(url: string): ParsedPostUrl {
	const trimmed = url.trim()

	// Check each pattern
	for (const [platform, pattern] of Object.entries(URL_PATTERNS)) {
		const match = trimmed.match(pattern)
		if (match) {
			const username = match[2]
			const postId = match[3]
			return {
				isValid: true,
				platform: platform === "twitter" ? "twitter" : "x",
				username,
				postId,
				normalizedUrl: `https://x.com/${username}/status/${postId}`
			}
		}
	}

	return {
		isValid: false,
		platform: null,
		username: null,
		postId: null,
		normalizedUrl: null
	}
}

interface UsePostUrlOptions {
	/** Initial URL value */
	initialValue?: string
	/** Callback when URL is validated successfully */
	onValid?: (parsed: ParsedPostUrl) => void
	/** Callback when URL is invalid */
	onInvalid?: (url: string) => void
}

interface UsePostUrlReturn {
	/** Current URL value */
	url: string
	/** Set the URL value */
	setUrl: (value: string) => void
	/** Clear the URL */
	clear: () => void
	/** Parsed URL data */
	parsed: ParsedPostUrl
	/** Whether the current URL is valid */
	isValid: boolean
	/** Validation error message */
	error: string
	/** Validate and return whether valid */
	validate: () => boolean
}

/**
 * Hook for managing X/Twitter post URL input with validation.
 * Use this in timestamp and verify features.
 */
export function usePostUrl(options: UsePostUrlOptions = {}): UsePostUrlReturn {
	const { initialValue = "", onValid, onInvalid } = options

	const [url, setUrlState] = useState(initialValue)
	const [error, setError] = useState("")

	const parsed = parsePostUrl(url)

	const setUrl = useCallback((value: string) => {
		setUrlState(value)
		setError("") // Clear error when user types
	}, [])

	const clear = useCallback(() => {
		setUrlState("")
		setError("")
	}, [])

	const validate = useCallback(() => {
		if (!url.trim()) {
			setError("Please enter a valid X post URL")
			onInvalid?.(url)
			return false
		}

		const result = parsePostUrl(url)
		if (!result.isValid) {
			setError("Invalid X post URL format")
			onInvalid?.(url)
			return false
		}

		setError("")
		onValid?.(result)
		return true
	}, [url, onValid, onInvalid])

	return {
		url,
		setUrl,
		clear,
		parsed,
		isValid: parsed.isValid,
		error,
		validate
	}
}
