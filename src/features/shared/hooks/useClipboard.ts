"use client"

import { useCallback, useState } from "react"

interface UseClipboardOptions {
	/** Duration in ms to show success state */
	successDuration?: number
	/** Callback when copy succeeds */
	onSuccess?: (text: string) => void
	/** Callback when copy fails */
	onError?: (error: Error) => void
}

interface UseClipboardReturn {
	/** Copy text to clipboard */
	copy: (text: string) => Promise<void>
	/** Whether the last copy was successful */
	copied: boolean
	/** Any error from the last copy attempt */
	error: Error | null
}

/**
 * Hook for copying text to clipboard with success/error states.
 * Provides consistent clipboard handling across features.
 */
export function useClipboard(
	options: UseClipboardOptions = {}
): UseClipboardReturn {
	const { successDuration = 2000, onSuccess, onError } = options

	const [copied, setCopied] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const copy = useCallback(
		async (text: string) => {
			if (typeof navigator === "undefined" || !navigator.clipboard) {
				const err = new Error("Clipboard API not available")
				setError(err)
				onError?.(err)
				return
			}

			try {
				await navigator.clipboard.writeText(text)
				setCopied(true)
				setError(null)
				onSuccess?.(text)

				// Reset copied state after duration
				setTimeout(() => {
					setCopied(false)
				}, successDuration)
			} catch (err) {
				const error = err instanceof Error ? err : new Error("Copy failed")
				setError(error)
				setCopied(false)
				onError?.(error)
			}
		},
		[successDuration, onSuccess, onError]
	)

	return { copy, copied, error }
}
