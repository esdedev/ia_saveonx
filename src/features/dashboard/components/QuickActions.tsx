import { Download, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickActionsProps {
	onTimestamp?: () => void
	onVerify?: () => void
	onBulkExport?: () => void
}

export function QuickActions({
	onTimestamp,
	onVerify,
	onBulkExport
}: QuickActionsProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700 mb-8">
			<CardHeader>
				<CardTitle className="text-white">Quick Actions</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Button
						variant="outline"
						className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 h-auto p-4"
						onClick={onTimestamp}
					>
						<div className="text-center">
							<Plus className="h-6 w-6 mx-auto mb-2" />
							<div className="font-medium">Timestamp Post</div>
							<div className="text-xs text-gray-400">
								Add new X post to blockchain
							</div>
						</div>
					</Button>
					<Button
						variant="outline"
						className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 h-auto p-4"
						onClick={onVerify}
					>
						<div className="text-center">
							<Search className="h-6 w-6 mx-auto mb-2" />
							<div className="font-medium">Verify Post</div>
							<div className="text-xs text-gray-400">
								Check if post is timestamped
							</div>
						</div>
					</Button>
					<Button
						variant="outline"
						className="border-green-500/50 text-green-400 hover:bg-green-500/10 h-auto p-4"
						onClick={onBulkExport}
					>
						<div className="text-center">
							<Download className="h-6 w-6 mx-auto mb-2" />
							<div className="font-medium">Bulk Export</div>
							<div className="text-xs text-gray-400">
								Download all verification reports
							</div>
						</div>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
