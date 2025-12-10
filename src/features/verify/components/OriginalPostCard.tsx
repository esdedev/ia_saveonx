import { Calendar, Twitter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
				<div className="bg-black rounded-lg p-6 border border-gray-600">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
							<Twitter className="h-6 w-6 text-white" />
						</div>
						<div>
							<div className="font-bold text-white">
								{result.originalContent.author}
							</div>
							<div className="text-sm text-gray-400">
								{result.originalContent.handle}
							</div>
						</div>
						<div className="ml-auto text-sm text-gray-400">
							<div className="flex items-center space-x-1">
								<Calendar className="h-4 w-4" />
								<span>
									{new Date(
										result.originalContent.timestamp
									).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
					<p className="text-white mb-4 leading-relaxed">
						{result.originalContent.content}
					</p>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6 text-gray-400 text-sm">
							<span className="flex items-center space-x-1">
								<span role="img" aria-label="replies">
									💬
								</span>
								<span>{result.originalContent.replies}</span>
							</span>
							<span className="flex items-center space-x-1">
								<span role="img" aria-label="retweets">
									🔄
								</span>
								<span>{result.originalContent.retweets}</span>
							</span>
							<span className="flex items-center space-x-1">
								<span role="img" aria-label="likes">
									❤️
								</span>
								<span>{result.originalContent.likes}</span>
							</span>
						</div>
						<Badge className="bg-green-500/20 text-green-400 border-green-500/30">
							✓ Preserved
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
