import { CheckCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PostPreview } from "@/features/timestamp/types"

interface PostPreviewSectionProps {
	postPreview: PostPreview
	onBack: () => void
	onNext: () => void
}

export function PostPreviewSection({
	postPreview,
	onBack,
	onNext
}: PostPreviewSectionProps) {
	return (
		<div className="space-y-6 mb-8">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white flex items-center space-x-2">
						<CheckCircle className="h-5 w-5 text-green-400" />
						<span>Preview</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="bg-black rounded-lg p-6 border border-gray-600">
						<div className="flex items-start space-x-4">
							<div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-400 rounded-full" />
							<div className="flex-1">
								<div className="flex items-center space-x-2 mb-2">
									<div className="font-bold text-white">
										{postPreview.author}
									</div>
									<div className="text-gray-400 text-sm">
										{postPreview.handle}
									</div>
									<div className="text-gray-600 text-sm">•</div>
									<div className="text-gray-600 text-sm">just now</div>
								</div>
								<p className="text-white mb-4 leading-relaxed">
									{postPreview.content}
								</p>
								<div className="flex items-center justify-between text-gray-600 text-sm">
									<span>💬 {postPreview.replies}</span>
									<span>🔄 {postPreview.retweets}</span>
									<span>❤️ {postPreview.likes}</span>
									<span>📤</span>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start space-x-3">
						<CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
						<div>
							<p className="text-green-400 font-medium">Post verified</p>
							<p className="text-green-300 text-sm">
								This post is accessible and ready to be timestamped.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex space-x-4">
				<Button
					variant="outline"
					className="flex-1 border-gray-600 text-gray-300 hover:text-white bg-transparent"
					onClick={onBack}
				>
					Back
				</Button>
				<Button
					className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
					onClick={onNext}
				>
					Select Networks
					<ChevronRight className="h-4 w-4 ml-2" />
				</Button>
			</div>
		</div>
	)
}
