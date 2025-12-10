import { AlertCircle, ChevronRight, LinkIcon, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UrlInputCardProps {
	postUrl: string
	error: string
	isLoading: boolean
	onPostUrlChange: (value: string) => void
	onSubmit: () => void
}

export function UrlInputCard({
	postUrl,
	error,
	isLoading,
	onPostUrlChange,
	onSubmit
}: UrlInputCardProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700 mb-8">
			<CardHeader>
				<CardTitle className="text-white flex items-center space-x-2">
					<LinkIcon className="h-5 w-5 text-blue-400" />
					<span>Paste X Post URL</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label htmlFor="post-url" className="text-gray-300 mb-2 block">
						Post URL
					</Label>
					<Input
						id="post-url"
						type="url"
						placeholder="https://x.com/username/status/1234567890"
						value={postUrl}
						onChange={(event) => onPostUrlChange(event.target.value)}
						className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12"
					/>
					{error && (
						<p className="text-red-400 text-sm mt-2 flex items-center">
							<AlertCircle className="h-4 w-4 mr-1" />
							{error}
						</p>
					)}
				</div>

				<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
					<p className="text-sm text-gray-300 mb-3 font-medium">
						Supported formats:
					</p>
					<ul className="text-sm text-gray-400 space-y-2">
						<li className="flex items-center">
							<span className="text-blue-400 mr-2">•</span>
							https://x.com/username/status/1234567890
						</li>
						<li className="flex items-center">
							<span className="text-blue-400 mr-2">•</span>
							https://twitter.com/username/status/1234567890
						</li>
						<li className="flex items-center">
							<span className="text-blue-400 mr-2">•</span>
							x.com/username/status/1234567890
						</li>
					</ul>
				</div>

				<Button
					onClick={onSubmit}
					disabled={isLoading || !postUrl.trim()}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg"
				>
					{isLoading ? (
						<>
							<Loader className="h-4 w-4 mr-2 animate-spin" />
							Fetching Post...
						</>
					) : (
						<>
							Continue
							<ChevronRight className="h-4 w-4 ml-2" />
						</>
					)}
				</Button>
			</CardContent>
		</Card>
	)
}
