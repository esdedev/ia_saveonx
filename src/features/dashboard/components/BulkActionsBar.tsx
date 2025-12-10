import { Download, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulkActionsBarProps {
	selectedCount: number
	onClearSelection: () => void
	onExportSelected?: () => void
	onVerifySelected?: () => void
}

export function BulkActionsBar({
	selectedCount,
	onClearSelection,
	onExportSelected,
	onVerifySelected
}: BulkActionsBarProps) {
	if (selectedCount === 0) {
		return null
	}

	return (
		<div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-300">
					{selectedCount} item{selectedCount > 1 ? "s" : ""} selected
				</span>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						className="border-gray-600 text-gray-300"
						onClick={onExportSelected}
					>
						<Download className="h-4 w-4 mr-2" />
						Export Selected
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="border-gray-600 text-gray-300"
						onClick={onVerifySelected}
					>
						<Shield className="h-4 w-4 mr-2" />
						Verify Selected
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onClearSelection}
						className="border-gray-600 text-gray-300"
					>
						Clear Selection
					</Button>
				</div>
			</div>
		</div>
	)
}
