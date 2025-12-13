import { type NextRequest, NextResponse } from "next/server"
import {
	createTimestampAction,
	getUserLimits
} from "@/features/timestamp/actions/timestamp"
import { isValidBlockchain, VALID_BLOCKCHAIN_IDS } from "@/lib/blockchain"

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

		// Validate blockchain (uses centralized config)
		if (!isValidBlockchain(blockchain)) {
			return NextResponse.json(
				{
					error: `Invalid blockchain. Must be one of: ${VALID_BLOCKCHAIN_IDS.join(", ")}`
				},
				{ status: 400 }
			)
		}

		// Create timestamp
		const result = await createTimestampAction({ userId, postUrl, blockchain })

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 })
		}

		return NextResponse.json({
			success: true,
			timestampId: result.data.timestampId,
			transactionHash: result.data.transactionHash,
			post: result.data.post
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

		const limitsResult = await getUserLimits(userId)

		if (!limitsResult.success) {
			return NextResponse.json({ error: limitsResult.error }, { status: 400 })
		}

		return NextResponse.json({
			limits: limitsResult.data
		})
	} catch (error) {
		console.error("Error in GET /api/timestamps:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
