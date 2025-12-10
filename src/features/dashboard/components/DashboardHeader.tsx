import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
	onCreateTimestamp?: () => void
}

export function DashboardHeader({ onCreateTimestamp }: DashboardHeaderProps) {
	return (
		<div className="flex justify-between items-center mb-8">
			<div>
				<h1 className="text-3xl font-bold text-white">Dashboard</h1>
				<p className="text-gray-400 mt-1">
					Manage your timestamped posts and account
				</p>
			</div>
			<Button
				className="bg-blue-500 hover:bg-blue-600 text-white"
				onClick={onCreateTimestamp}
			>
				<Plus className="h-4 w-4 mr-2" />
				New Timestamp
			</Button>
		</div>
	)
}
