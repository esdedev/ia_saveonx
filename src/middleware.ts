import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/timestamp", "/verify"]

// Routes that require admin access
const adminRoutes = ["/admin"]

// Routes only accessible when NOT authenticated
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Get session cookie - better-auth uses 'better-auth.session_token'
	const sessionCookie = request.cookies.get("better-auth.session_token")
	const isAuthenticated = !!sessionCookie?.value

	// Check if trying to access auth routes while authenticated
	if (authRoutes.some((route) => pathname.startsWith(route))) {
		if (isAuthenticated) {
			return NextResponse.redirect(new URL("/dashboard", request.url))
		}
		return NextResponse.next()
	}

	// Check if trying to access protected routes
	if (protectedRoutes.some((route) => pathname.startsWith(route))) {
		if (!isAuthenticated) {
			const loginUrl = new URL("/login", request.url)
			loginUrl.searchParams.set("callbackUrl", pathname)
			return NextResponse.redirect(loginUrl)
		}
	}

	// Check if trying to access admin routes
	// Note: For admin role check, we need to verify on the server side
	// The middleware can only check for authentication, not roles
	if (adminRoutes.some((route) => pathname.startsWith(route))) {
		if (!isAuthenticated) {
			const loginUrl = new URL("/login", request.url)
			loginUrl.searchParams.set("callbackUrl", pathname)
			return NextResponse.redirect(loginUrl)
		}
		// Role check will be done in the admin page/layout
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
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)",
	],
}
