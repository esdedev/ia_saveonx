import { type NextRequest, NextResponse } from "next/server"
import {
	verifyByHashAction,
	verifyPostAction
} from "@/features/verify/actions/verify"

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

		const result = await verifyPostAction({
			postUrl,
			userId
		})

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 })
		}

		return NextResponse.json(result.data)
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

		const result = await verifyByHashAction(hash)

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 })
		}

		return NextResponse.json(result.data)
	} catch (error) {
		console.error("Error in GET /api/verify:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
