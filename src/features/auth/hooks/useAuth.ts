"use client"

import { useCallback } from "react"
import { signOut as authSignOut, useSession } from "@/services/auth/auth-client"

/**
 * Custom hook to access authentication state and methods
 */
export function useAuth() {
	const { data: session, isPending, error } = useSession()

	const signOut = useCallback(async () => {
		await authSignOut()
		window.location.href = "/login"
	}, [])

	return {
		user: session?.user ?? null,
		session: session ?? null,
		isLoading: isPending,
		isAuthenticated: !!session?.user,
		isAdmin: session?.user?.role === "admin",
		error,
		signOut
	}
}
