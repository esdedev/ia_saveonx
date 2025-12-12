import { NextResponse } from "next/server"
import { upgradePendingOTSTimestamps } from "@/services/blockchain-timestamp-service"

/**
 * Cron endpoint to upgrade pending OpenTimestamps
 * 
 * This should be called periodically (e.g., every 10 minutes) to check
 * if any pending OTS timestamps have been confirmed in Bitcoin.
 * 
 * To protect this endpoint, use a secret token in the Authorization header.
 */
export async function GET(request: Request) {
	try {
		// Verify the cron secret
		const authHeader = request.headers.get("authorization")
		const cronSecret = process.env.CRON_SECRET

		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			)
		}

		// Upgrade pending timestamps
		const result = await upgradePendingOTSTimestamps()

		return NextResponse.json({
			success: true,
			...result,
			message: `Checked ${result.checked} timestamps, upgraded ${result.upgraded}, ${result.errors} errors`
		})
	} catch (error) {
		console.error("Cron upgrade error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

// Also allow POST for flexibility with cron providers
export { GET as POST }
