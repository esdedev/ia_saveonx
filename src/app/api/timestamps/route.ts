import { type NextRequest, NextResponse } from "next/server"
import { checkUserLimits, createTimestamp } from "@/lib/timestamp-service"

/**
 * POST /api/timestamps
 * Create a new timestamp for a post
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		const { userId, postUrl, blockchain } = body

		// Validate required fields
		if (!userId || !postUrl || !blockchain) {
			return NextResponse.json(
				{ error: "Missing required fields: userId, postUrl, blockchain" },
				{ status: 400 }
			)
		}

		// Validate blockchain
		const validBlockchains = ["ethereum", "polygon", "base", "solana"]
		if (!validBlockchains.includes(blockchain)) {
			return NextResponse.json(
				{
					error: `Invalid blockchain. Must be one of: ${validBlockchains.join(", ")}`
				},
				{ status: 400 }
			)
		}

		// Create timestamp
		const result = await createTimestamp({ userId, postUrl, blockchain })

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 })
		}

		return NextResponse.json({
			success: true,
			timestamp: result.timestamp,
			post: result.post
		})
	} catch (error) {
		console.error("Error in POST /api/timestamps:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

/**
 * GET /api/timestamps?userId=xxx
 * Get user's timestamps with usage limits
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get("userId")

		if (!userId) {
			return NextResponse.json(
				{ error: "Missing userId parameter" },
				{ status: 400 }
			)
		}

		const limits = await checkUserLimits(userId)

		return NextResponse.json({
			limits
		})
	} catch (error) {
		console.error("Error in GET /api/timestamps:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
