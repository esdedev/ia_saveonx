"use client"

import { useMemo, useState } from "react"
// import { ToastContainer } from "@/components/toast-container"
import { BulkActionsBar } from "@/features/dashboard/components/BulkActionsBar"
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader"
import { DashboardNavigation } from "@/features/dashboard/components/DashboardNavigation"
import { PaginationControls } from "@/features/dashboard/components/PaginationControls"
import { QuickActions } from "@/features/dashboard/components/QuickActions"
import { RecentTimestampsTable } from "@/features/dashboard/components/RecentTimestampsTable"
import { StatsOverview } from "@/features/dashboard/components/StatsOverview"
import {
	MOCK_RECENT_TIMESTAMPS,
	MOCK_USER_STATS
} from "@/features/dashboard/data/mock"
import type { FilterStatus } from "@/features/dashboard/types"
import { filterTimestamps } from "@/features/dashboard/utils/filters"
// import { useWebSocket } from "@/lib/websocket"

export default function DashboardPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
	const [selectedRecords, setSelectedRecords] = useState<string[]>([])

	// const {
	// 	connectionState,
	// 	notifications,
	// 	unreadCount,
	// 	markAsRead,
	// 	markAllAsRead,
	// 	clearNotification,
	// 	clearAllNotifications
	// } = useWebSocket(
	// 	process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
	// 	"user_token_here"
	// )

	const filteredTimestamps = useMemo(
		() => filterTimestamps(MOCK_RECENT_TIMESTAMPS, searchQuery, filterStatus),
		[filterStatus, searchQuery]
	)

	const handleSearchChange = (value: string) => {
		setSearchQuery(value)
	}

	const handleFilterChange = (status: FilterStatus) => {
		setFilterStatus(status)
	}

	const handleToggleRecord = (recordId: string, isSelected: boolean) => {
		setSelectedRecords((previous) => {
			if (isSelected) {
				if (previous.includes(recordId)) {
					return previous
				}
				return [...previous, recordId]
			}

			return previous.filter((id) => id !== recordId)
		})
	}

	const handleToggleSelectAll = (recordIds: string[], selectAll: boolean) => {
		setSelectedRecords((previous) => {
			if (selectAll) {
				const next = new Set(previous)
				for (const id of recordIds) {
					next.add(id)
				}
				return Array.from(next)
			}

			return previous.filter((id) => !recordIds.includes(id))
		})
	}

	const handleClearSelection = () => {
		setSelectedRecords([])
	}

	const canSelectAll = filteredTimestamps.length > 0

	return (
		<div className="min-h-screen bg-black text-white">
			{/* <DashboardNavigation
				connectionState={connectionState}
				notifications={notifications}
				unreadCount={unreadCount}
				onMarkAsRead={markAsRead}
				onMarkAllAsRead={markAllAsRead}
				onClearNotification={clearNotification}
				onClearAll={clearAllNotifications}
			/> */}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<DashboardHeader />
				<StatsOverview stats={MOCK_USER_STATS} />
				<QuickActions />

				<RecentTimestampsTable
					records={filteredTimestamps}
					searchQuery={searchQuery}
					filterStatus={filterStatus}
					selectedRecords={selectedRecords}
					onSearchChange={handleSearchChange}
					onFilterChange={handleFilterChange}
					onToggleRecord={handleToggleRecord}
					onToggleSelectAll={canSelectAll ? handleToggleSelectAll : undefined}
					actionsSlot={
						<>
							{selectedRecords.length > 0 && (
								<div className="mt-4">
									<BulkActionsBar
										selectedCount={selectedRecords.length}
										onClearSelection={handleClearSelection}
									/>
								</div>
							)}
							<PaginationControls
								label="Showing 1-5 of 247 timestamps"
								pageNumbers={[1, 2, 3]}
								currentPage={2}
								hasPrevious
								hasNext
							/>
						</>
					}
				/>
			</div>
			{/* <ToastContainer notifications={notifications} /> */}
		</div>
	)
}
