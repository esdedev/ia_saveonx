import { type NextRequest, NextResponse } from "next/server"
import { stampTweetMvpAction } from "@/services/x/get-post"

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams
	const postId = query.get("postId")
	if (!postId) {
		return NextResponse.json(
			{ error: "postId query parameter is required" },
			{ status: 400 },
		)
	}
	const doYourThing = await stampTweetMvpAction(postId)
	return NextResponse.json(doYourThing)
}
