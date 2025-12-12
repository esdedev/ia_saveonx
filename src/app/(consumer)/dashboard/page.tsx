"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
	type DashboardTimestamp,
	exportTimestamps,
	getDashboardStats,
	getDashboardTimestamps
} from "@/features/dashboard/actions/dashboard"
import { BulkActionsBar } from "@/features/dashboard/components/BulkActionsBar"
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader"
import { PaginationControls } from "@/features/dashboard/components/PaginationControls"
import { QuickActions } from "@/features/dashboard/components/QuickActions"
import { RecentTimestampsTable } from "@/features/dashboard/components/RecentTimestampsTable"
import { StatsOverview } from "@/features/dashboard/components/StatsOverview"
import type {
	FilterStatus,
	TimestampRecord,
	UserStats
} from "@/features/dashboard/types"
import { filterTimestamps } from "@/features/dashboard/utils/filters"
import { PageLayout } from "@/features/shared/components/PageLayout"

// Items per page for pagination
const ITEMS_PER_PAGE = 10

export default function DashboardPage() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState("")
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
	const [selectedRecords, setSelectedRecords] = useState<string[]>([])
	const [currentPage, setCurrentPage] = useState(1)

	// Data state
	const [stats, setStats] = useState<UserStats | null>(null)
	const [timestamps, setTimestamps] = useState<TimestampRecord[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Fetch dashboard data
	const fetchData = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		try {
			const [statsResult, timestampsResult] = await Promise.all([
				getDashboardStats(),
				getDashboardTimestamps()
			])

			if (statsResult.success) {
				setStats({
					totalTimestamps: statsResult.data.totalTimestamps,
					thisMonth: statsResult.data.thisMonth,
					verifications: statsResult.data.verifications,
					savedCosts: "$0", // TODO: Calculate actual savings
					remaining: statsResult.data.remaining,
					limit: statsResult.data.limit,
					tier: statsResult.data.tier
				})
			} else {
				setError(statsResult.error)
			}

			if (timestampsResult.success) {
				// Map to TimestampRecord format
				const records: TimestampRecord[] = timestampsResult.data.map(
					(ts: DashboardTimestamp) => ({
						id: ts.id,
						postUrl: ts.postUrl,
						author: ts.author,
						content: ts.content,
						timestampedAt: ts.timestampedAt,
						status: ts.status,
						networks: ts.networks,
						cost: ts.cost,
						verificationCount: ts.verificationCount
					})
				)
				setTimestamps(records)
			}
		} catch (err) {
			console.error("Error fetching dashboard data:", err)
			setError("Failed to load dashboard data")
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const filteredTimestamps = useMemo(
		() => filterTimestamps(timestamps, searchQuery, filterStatus),
		[timestamps, filterStatus, searchQuery]
	)

	// Pagination
	const totalPages = Math.ceil(filteredTimestamps.length / ITEMS_PER_PAGE)
	const paginatedTimestamps = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE
		return filteredTimestamps.slice(start, start + ITEMS_PER_PAGE)
	}, [filteredTimestamps, currentPage])

	const pageNumbers = useMemo(() => {
		const pages: number[] = []
		const maxVisible = 5
		const half = Math.floor(maxVisible / 2)
		let start = Math.max(1, currentPage - half)
		const end = Math.min(totalPages, start + maxVisible - 1)
		start = Math.max(1, end - maxVisible + 1)
		for (let i = start; i <= end; i++) {
			pages.push(i)
		}
		return pages
	}, [currentPage, totalPages])

	const handleSearchChange = (value: string) => {
		setSearchQuery(value)
		setCurrentPage(1)
	}

	const handleFilterChange = (status: FilterStatus) => {
		setFilterStatus(status)
		setCurrentPage(1)
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

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	// Navigation handlers
	const handleCreateTimestamp = () => {
		router.push("/timestamp")
	}

	const handleVerify = () => {
		router.push("/verify")
	}

	const handleBulkExport = async () => {
		const result = await exportTimestamps(selectedRecords)
		if (result.success) {
			// Create and download the file
			const blob = new Blob([result.data.data], { type: "application/json" })
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = result.data.filename
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	// Record action handlers
	const handleViewRecord = (recordId: string) => {
		router.push(`/verify?id=${recordId}`)
	}

	const handleDownloadRecord = async (recordId: string) => {
		const result = await exportTimestamps([recordId])
		if (result.success) {
			const blob = new Blob([result.data.data], { type: "application/json" })
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `timestamp-${recordId}.json`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	const canSelectAll = paginatedTimestamps.length > 0

	// Calculate pagination label
	const startItem =
		filteredTimestamps.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
	const endItem = Math.min(
		currentPage * ITEMS_PER_PAGE,
		filteredTimestamps.length
	)
	const paginationLabel = `Showing ${startItem}-${endItem} of ${filteredTimestamps.length} timestamps`

	if (isLoading) {
		return (
			<PageLayout>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
				</div>
			</PageLayout>
		)
	}

	if (error) {
		return (
			<PageLayout>
				<div className="text-center py-16">
					<p className="text-red-400">{error}</p>
					<button
						type="button"
						onClick={fetchData}
						className="mt-4 text-blue-400 hover:underline"
					>
						Try again
					</button>
				</div>
			</PageLayout>
		)
	}

	return (
		<PageLayout>
			<DashboardHeader onCreateTimestamp={handleCreateTimestamp} />
			{stats && <StatsOverview stats={stats} />}
			<QuickActions
				onTimestamp={handleCreateTimestamp}
				onVerify={handleVerify}
				onBulkExport={handleBulkExport}
			/>

			<RecentTimestampsTable
				records={paginatedTimestamps}
				searchQuery={searchQuery}
				filterStatus={filterStatus}
				selectedRecords={selectedRecords}
				onSearchChange={handleSearchChange}
				onFilterChange={handleFilterChange}
				onToggleRecord={handleToggleRecord}
				onToggleSelectAll={canSelectAll ? handleToggleSelectAll : undefined}
				onViewRecord={handleViewRecord}
				onDownloadRecord={handleDownloadRecord}
				onCreateTimestamp={handleCreateTimestamp}
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
						{totalPages > 1 && (
							<PaginationControls
								label={paginationLabel}
								pageNumbers={pageNumbers}
								currentPage={currentPage}
								hasPrevious={currentPage > 1}
								hasNext={currentPage < totalPages}
								onPageChange={handlePageChange}
							/>
						)}
					</>
				}
			/>
		</PageLayout>
	)
}
