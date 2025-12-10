"use client"

import { useCallback, useState } from "react"

type AsyncStatus = "idle" | "loading" | "success" | "error"

interface UseAsyncOperationOptions<T> {
	/** Callback when operation succeeds */
	onSuccess?: (result: T) => void
	/** Callback when operation fails */
	onError?: (error: Error) => void
	/** Reset to idle after success (ms) */
	resetAfterSuccess?: number
}

interface UseAsyncOperationReturn<T> {
	/** Execute the async operation */
	execute: () => Promise<T | null>
	/** Current status */
	status: AsyncStatus
	/** Whether currently loading */
	isLoading: boolean
	/** Whether operation succeeded */
	isSuccess: boolean
	/** Whether operation failed */
	isError: boolean
	/** Error from last operation */
	error: Error | null
	/** Result from last successful operation */
	result: T | null
	/** Reset to idle state */
	reset: () => void
}

/**
 * Hook for managing async operations with loading/success/error states.
 * Reduces boilerplate for common async patterns.
 */
export function useAsyncOperation<T>(
	operation: () => Promise<T>,
	options: UseAsyncOperationOptions<T> = {}
): UseAsyncOperationReturn<T> {
	const { onSuccess, onError, resetAfterSuccess } = options

	const [status, setStatus] = useState<AsyncStatus>("idle")
	const [error, setError] = useState<Error | null>(null)
	const [result, setResult] = useState<T | null>(null)

	const reset = useCallback(() => {
		setStatus("idle")
		setError(null)
		setResult(null)
	}, [])

	const execute = useCallback(async () => {
		setStatus("loading")
		setError(null)

		try {
			const data = await operation()
			setResult(data)
			setStatus("success")
			onSuccess?.(data)

			if (resetAfterSuccess) {
				setTimeout(reset, resetAfterSuccess)
			}

			return data
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Operation failed")
			setError(error)
			setStatus("error")
			onError?.(error)
			return null
		}
	}, [operation, onSuccess, onError, resetAfterSuccess, reset])

	return {
		execute,
		status,
		isLoading: status === "loading",
		isSuccess: status === "success",
		isError: status === "error",
		error,
		result,
		reset
	}
}
