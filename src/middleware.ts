import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Routes only accessible when NOT authenticated
const authRoutes = ["/login", "/register"]

// Public routes (accessible by anyone)
const publicRoutes = ["/"]

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Skip middleware for API routes, static files, and public assets
	if (
		pathname.startsWith("/api") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon.ico") ||
		pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)
	) {
		return NextResponse.next()
	}

	// Check for session cookie (better-auth uses 'better-auth.session_token')
	const sessionToken = request.cookies.get("better-auth.session_token")
	const isAuthenticated = !!sessionToken?.value

	// Allow access to public routes
	if (publicRoutes.some((route) => pathname === route)) {
		return NextResponse.next()
	}

	// Redirect authenticated users away from auth pages
	if (authRoutes.some((route) => pathname.startsWith(route))) {
		if (isAuthenticated) {
			return NextResponse.redirect(new URL("/dashboard", request.url))
		}
		return NextResponse.next()
	}

	// Protect all other routes (everything not explicitly public or auth)
	if (!isAuthenticated) {
		const loginUrl = new URL("/login", request.url)
		loginUrl.searchParams.set("callbackUrl", pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)"
	]
}
