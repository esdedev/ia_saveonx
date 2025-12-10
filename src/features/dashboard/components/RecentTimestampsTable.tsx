import {
	Download,
	Eye,
	FileText,
	MoreHorizontal,
	Plus,
	Search
} from "lucide-react"
import type { ChangeEvent, ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { FilterStatus, TimestampRecord } from "@/features/dashboard/types"
import { getStatusConfig } from "@/features/dashboard/utils/status"

interface RecentTimestampsTableProps {
	records: TimestampRecord[]
	searchQuery: string
	filterStatus: FilterStatus
	selectedRecords: string[]
	onSearchChange: (value: string) => void
	onFilterChange: (status: FilterStatus) => void
	onToggleRecord: (recordId: string, isSelected: boolean) => void
	onToggleSelectAll?: (recordIds: string[], selectAll: boolean) => void
	actionsSlot?: ReactNode
}

export function RecentTimestampsTable({
	records,
	searchQuery,
	filterStatus,
	selectedRecords,
	onSearchChange,
	onFilterChange,
	onToggleRecord,
	onToggleSelectAll,
	actionsSlot
}: RecentTimestampsTableProps) {
	const handleHeaderCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!onToggleSelectAll) {
			return
		}

		const recordIds = records.map((record) => record.id)
		onToggleSelectAll(recordIds, event.target.checked)
	}

	const isAllSelected =
		records.length > 0 &&
		records.every((record) => selectedRecords.includes(record.id))

	return (
		<Card className="bg-gray-900/50 border-gray-700">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-white">Recent Timestamps</CardTitle>
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<Search className="h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search timestamps..."
								value={searchQuery}
								onChange={(event) => onSearchChange(event.target.value)}
								className="w-64 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
							/>
						</div>
						<select
							value={filterStatus}
							onChange={(event) =>
								onFilterChange(event.target.value as FilterStatus)
							}
							className="bg-gray-800 border-gray-600 text-white rounded-md px-3 py-2"
						>
							<option value="all">All Status</option>
							<option value="verified">Verified</option>
							<option value="pending">Pending</option>
							<option value="failed">Failed</option>
						</select>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-700">
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									<input
										type="checkbox"
										className="rounded border-gray-600 bg-gray-700"
										checked={isAllSelected}
										onChange={handleHeaderCheckboxChange}
										aria-label="Select all timestamps"
										disabled={records.length === 0}
									/>
								</th>
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									Post
								</th>
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									Status
								</th>
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									Networks
								</th>
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									Timestamped
								</th>
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									Cost
								</th>
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									Verifications
								</th>
								<th className="text-left py-3 px-4 text-gray-400 font-medium">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{records.map((record) => {
								const statusConfig = getStatusConfig(record.status)
								const StatusIcon = statusConfig.icon
								const isSelected = selectedRecords.includes(record.id)

								return (
									<tr
										key={record.id}
										className="border-b border-gray-800 hover:bg-gray-800/50"
									>
										<td className="py-4 px-4">
											<input
												type="checkbox"
												checked={isSelected}
												onChange={(event) =>
													onToggleRecord(record.id, event.target.checked)
												}
												className="rounded border-gray-600 bg-gray-700"
												aria-label={`Select timestamp ${record.id}`}
											/>
										</td>
										<td className="py-4 px-4">
											<div className="max-w-md">
												<div className="font-medium text-white mb-1">
													{record.author}
												</div>
												<div className="text-sm text-gray-400 truncate">
													{record.content}
												</div>
												<div className="text-xs text-blue-400 mt-1 truncate">
													{record.postUrl}
												</div>
											</div>
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center space-x-2">
												<StatusIcon className="h-4 w-4" />
												<Badge className={statusConfig.badgeClass}>
													{statusConfig.label}
												</Badge>
											</div>
										</td>
										<td className="py-4 px-4">
											<div className="flex flex-wrap gap-1">
												{record.networks.map((network) => (
													<Badge
														key={network}
														variant="outline"
														className="text-xs"
													>
														{network}
													</Badge>
												))}
											</div>
										</td>
										<td className="py-4 px-4">
											<div className="text-sm text-gray-300">
												{new Date(record.timestampedAt).toLocaleDateString()}
											</div>
											<div className="text-xs text-gray-400">
												{new Date(record.timestampedAt).toLocaleTimeString()}
											</div>
										</td>
										<td className="py-4 px-4">
											<span className="text-sm text-gray-300">
												{record.cost}
											</span>
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center space-x-1">
												<Eye className="h-4 w-4 text-gray-400" />
												<span className="text-sm text-gray-300">
													{record.verificationCount}
												</span>
											</div>
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center space-x-2">
												<Button
													variant="ghost"
													size="sm"
													className="text-gray-400 hover:text-white"
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-gray-400 hover:text-white"
												>
													<Download className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-gray-400 hover:text-white"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>

				{records.length === 0 && (
					<div className="text-center py-12">
						<FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
						<h3 className="text-xl font-medium text-white mb-2">
							No timestamps found
						</h3>
						<p className="text-gray-400 mb-6">
							{searchQuery || filterStatus !== "all"
								? "Try adjusting your search or filter criteria"
								: "Start by timestamping your first X post"}
						</p>
						<Button className="bg-blue-500 hover:bg-blue-600 text-white">
							<Plus className="h-4 w-4 mr-2" />
							Timestamp Your First Post
						</Button>
					</div>
				)}

				{actionsSlot}
			</CardContent>
		</Card>
	)
}
