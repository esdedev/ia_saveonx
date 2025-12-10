import { Twitter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostPreviewCard } from "@/features/shared/components"
import type { VerificationResult } from "@/features/verify/types"

interface OriginalPostCardProps {
	result: VerificationResult
}

export function OriginalPostCard({ result }: OriginalPostCardProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700">
			<CardHeader>
				<CardTitle className="text-white flex items-center space-x-2">
					<Twitter className="h-5 w-5 text-blue-400" />
					<span>Preserved Content</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<PostPreviewCard
					post={{
						author: result.originalContent.author,
						handle: result.originalContent.handle,
						timestamp: new Date(
							result.originalContent.timestamp
						).toLocaleDateString(),
						content: result.originalContent.content,
						replies: result.originalContent.replies,
						retweets: result.originalContent.retweets,
						likes: result.originalContent.likes
					}}
					badgeText="Preserved"
					badgeVariant="success"
				/>
			</CardContent>
		</Card>
	)
}
