import { AlertTriangle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PostSearchCardProps {
	postUrl: string
	error: string
	isSearching: boolean
	onPostUrlChange: (value: string) => void
	onVerify: () => void
}

export function PostSearchCard({
	postUrl,
	error,
	isSearching,
	onPostUrlChange,
	onVerify
}: PostSearchCardProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700 mb-8">
			<CardHeader>
				<CardTitle className="text-white flex items-center space-x-2">
					<Search className="h-5 w-5 text-blue-400" />
					<span>Post Verification</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label htmlFor="post-url" className="text-gray-300 mb-2 block">
						X Post URL
					</Label>
					<div className="flex flex-col gap-4 md:flex-row md:items-center">
						<Input
							id="post-url"
							type="url"
							placeholder="https://x.com/username/status/1234567890"
							value={postUrl}
							onChange={(event) => onPostUrlChange(event.target.value)}
							className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
						/>
						<Button
							onClick={onVerify}
							disabled={isSearching}
							className="bg-blue-500 hover:bg-blue-600 text-white px-8"
						>
							{isSearching ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Verifying...
								</>
							) : (
								<>
									<Search className="h-4 w-4 mr-2" />
									Verify
								</>
							)}
						</Button>
					</div>
					{error && (
						<p className="text-red-400 text-sm mt-2 flex items-center">
							<AlertTriangle className="h-4 w-4 mr-1" />
							{error}
						</p>
					)}
				</div>
				<div className="text-sm text-gray-400">
					<p className="mb-2">Supported formats:</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li>https://x.com/username/status/1234567890</li>
						<li>https://twitter.com/username/status/1234567890</li>
						<li>x.com/username/status/1234567890</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}
