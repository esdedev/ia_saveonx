import { CheckCircle, Copy, Loader, Shield, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type {
	BlockchainOption,
	PostPreview,
	SubmissionResult
} from "@/features/timestamp/types"

interface ConfirmationSectionProps {
	postPreview: PostPreview
	selectedNetworkIds: string[]
	options: BlockchainOption[]
	totalCost: number
	isSubmitting: boolean
	submissionResult: SubmissionResult | null
	onSubmit: () => void
	onBack: () => void
	onReset: () => void
	onGoToDashboard: () => void
	onCopy: (value: string) => void
}

export function ConfirmationSection({
	postPreview,
	selectedNetworkIds,
	options,
	totalCost,
	isSubmitting,
	submissionResult,
	onSubmit,
	onBack,
	onReset,
	onGoToDashboard,
	onCopy
}: ConfirmationSectionProps) {
	return (
		<div className="space-y-6 mb-8">
			{submissionResult ? (
				<SubmissionResultCard
					selectedNetworkIds={selectedNetworkIds}
					options={options}
					submissionResult={submissionResult}
					onCopy={onCopy}
				/>
			) : (
				<ReviewSubmissionCard
					postPreview={postPreview}
					selectedNetworkIds={selectedNetworkIds}
					options={options}
					totalCost={totalCost}
				/>
			)}

			{submissionResult ? (
				<div className="flex space-x-4">
					<Button
						variant="outline"
						className="flex-1 border-gray-600 text-gray-300 hover:text-white bg-transparent"
						onClick={onGoToDashboard}
					>
						Go to Dashboard
					</Button>
					<Button
						className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
						onClick={onReset}
					>
						Timestamp Another Post
					</Button>
				</div>
			) : (
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
						onClick={onSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader className="h-4 w-4 mr-2 animate-spin" />
								Submitting...
							</>
						) : (
							<>
								<Shield className="h-4 w-4 mr-2" />
								Submit & Timestamp
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	)
}

interface ReviewSubmissionCardProps {
	postPreview: PostPreview
	selectedNetworkIds: string[]
	options: BlockchainOption[]
	totalCost: number
}

function ReviewSubmissionCard({
	postPreview,
	selectedNetworkIds,
	options,
	totalCost
}: ReviewSubmissionCardProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700">
			<CardHeader>
				<CardTitle className="text-white flex items-center space-x-2">
					<Shield className="h-5 w-5 text-green-400" />
					<span>Review & Submit</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<h4 className="font-bold text-white mb-3">Post Summary</h4>
					<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
						<p className="text-gray-300">{postPreview.content}</p>
						<p className="text-gray-500 text-sm mt-3">
							By {postPreview.handle}
						</p>
					</div>
				</div>

				<div>
					<h4 className="font-bold text-white mb-3">Selected Networks</h4>
					<div className="flex flex-wrap gap-2">
						{selectedNetworkIds.map((networkId) => {
							const network = options.find((item) => item.id === networkId)

							return (
								<Badge
									key={networkId}
									className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1"
								>
									{network?.name}
								</Badge>
							)
						})}
					</div>
				</div>

				<div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/30">
					<div className="flex items-center justify-between">
						<span className="font-bold text-white">Total Cost</span>
						<span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{totalCost === 0 ? "Free" : `$${totalCost.toFixed(2)}`}
						</span>
					</div>
				</div>

				<div className="flex items-start space-x-3">
					<input
						type="checkbox"
						id="terms"
						className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700"
					/>
					<label htmlFor="terms" className="text-sm text-gray-400">
						I understand that this timestamp will be permanently recorded on the
						blockchain and cannot be modified or deleted.
					</label>
				</div>
			</CardContent>
		</Card>
	)
}

interface SubmissionResultCardProps {
	selectedNetworkIds: string[]
	options: BlockchainOption[]
	submissionResult: SubmissionResult
	onCopy: (value: string) => void
}

function SubmissionResultCard({
	selectedNetworkIds,
	options,
	submissionResult,
	onCopy
}: SubmissionResultCardProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700">
			<CardHeader>
				<CardTitle className="text-white flex items-center space-x-2">
					<CheckCircle className="h-5 w-5 text-green-400" />
					<span>Timestamp Submitted Successfully!</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
					<CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
					<h3 className="text-xl font-bold text-white mb-2">
						Post Timestamped
					</h3>
					<p className="text-green-400">
						Your X post has been successfully timestamped on the blockchain.
					</p>
				</div>

				<div className="space-y-3">
					<h4 className="font-bold text-white">Transaction Details</h4>

					<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
						<div className="space-y-3">
							<div>
								<p className="text-gray-400 text-sm">Transaction ID</p>
								<div className="flex items-center justify-between mt-1">
									<p className="font-mono text-white text-sm break-all">
										{submissionResult.transactionId}
									</p>
									<Button
										variant="ghost"
										size="sm"
										className="text-blue-400 hover:text-blue-300"
										onClick={() => onCopy(submissionResult.transactionId)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="border-t border-gray-700 pt-3">
								<p className="text-gray-400 text-sm">Blockchain Hash</p>
								<div className="flex items-center justify-between mt-1">
									<p className="font-mono text-white text-sm break-all">
										{submissionResult.hash}
									</p>
									<Button
										variant="ghost"
										size="sm"
										className="text-blue-400 hover:text-blue-300"
										onClick={() => onCopy(submissionResult.hash)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<div className="border-t border-gray-700 pt-3">
								<p className="text-gray-400 text-sm">Networks</p>
								<div className="flex flex-wrap gap-2 mt-2">
									{selectedNetworkIds.map((networkId) => {
										const network = options.find(
											(item) => item.id === networkId
										)

										return (
											<Badge
												key={networkId}
												className="bg-green-500/20 text-green-400 border-green-500/30"
											>
												{network?.name}
											</Badge>
										)
									})}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
					<h4 className="font-bold text-white mb-3 flex items-center space-x-2">
						<Zap className="h-4 w-4 text-blue-400" />
						<span>What happens next?</span>
					</h4>
					<ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
						<li>Your post is being recorded on the selected blockchains</li>
						<li>
							You'll receive email confirmation when timestamping completes
						</li>
						<li>
							View your post in your dashboard and share the verification link
						</li>
					</ol>
				</div>
			</CardContent>
		</Card>
	)
}
