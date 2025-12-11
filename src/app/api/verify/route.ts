import { type NextRequest, NextResponse } from "next/server"
import { verifyByContentHash, verifyPost } from "@/lib/verification-service"

/**
 * POST /api/verify
 * Verify a timestamped post
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		const { postUrl, userId } = body

		if (!postUrl) {
			return NextResponse.json(
				{ error: "Missing required field: postUrl" },
				{ status: 400 }
			)
		}

		// Get client info for verification record
		const ipAddress =
			request.headers.get("x-forwarded-for")?.split(",")[0] ||
			request.headers.get("x-real-ip") ||
			"unknown"
		const userAgent = request.headers.get("user-agent") || "unknown"

		const result = await verifyPost({
			postUrl,
			userId,
			ipAddress,
			userAgent
		})

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 })
		}

		return NextResponse.json(result)
	} catch (error) {
		console.error("Error in POST /api/verify:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

/**
 * GET /api/verify?hash=xxx
 * Verify by content hash (for API/SDK usage)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const hash = searchParams.get("hash")

		if (!hash) {
			return NextResponse.json(
				{ error: "Missing hash parameter" },
				{ status: 400 }
			)
		}

		const result = await verifyByContentHash(hash)

		return NextResponse.json(result)
	} catch (error) {
		console.error("Error in GET /api/verify:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
