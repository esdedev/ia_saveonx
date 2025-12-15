import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/services/auth/auth"

/**
 * Get the current session on the server side
 */
export async function getServerSession() {
	const session = await auth.api.getSession({
		headers: await headers()
	})
	return session
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
	const session = await getServerSession()
	if (!session) {
		redirect("/login")
	}
	return session
}

/**
 * Require admin role - redirects to dashboard if not admin
 */
export async function requireAdmin() {
	const session = await requireAuth()
	if (session.user.role !== "admin") {
		redirect("/dashboard")
	}
	return session
}

/**
 * Check if user is authenticated (doesn't redirect)
 */
export async function isAuthenticated() {
	const session = await getServerSession()
	return !!session
}

/**
 * Check if user is admin (doesn't redirect)
 */
export async function isAdmin() {
	const session = await getServerSession()
	return session?.user.role === "admin"
}
