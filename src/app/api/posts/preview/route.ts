import { type NextRequest, NextResponse } from "next/server"
import { fetchXPost, parseXPostUrl } from "@/services/x-service"

/**
 * GET /api/posts/preview?url=xxx
 * Get preview data for a post (before timestamping)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const url = searchParams.get("url")

		if (!url) {
			return NextResponse.json(
				{ error: "Missing url parameter" },
				{ status: 400 }
			)
		}

		// Validate URL format
		const parsed = parseXPostUrl(url)

		if (!parsed.isValid) {
			return NextResponse.json(
				{ error: "Invalid X/Twitter post URL" },
				{ status: 400 }
			)
		}

		// Fetch post data
		const postData = await fetchXPost(url)

		if (!postData) {
			return NextResponse.json(
				{ error: "Failed to fetch post. It may be deleted or private." },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			success: true,
			post: postData
		})
	} catch (error) {
		console.error("Error in GET /api/posts/preview:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
