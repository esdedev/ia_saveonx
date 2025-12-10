import type { FilterStatus, TimestampRecord } from "@/features/dashboard/types"

export const filterTimestamps = (
	records: TimestampRecord[],
	query: string,
	status: FilterStatus
): TimestampRecord[] => {
	const normalizedQuery = query.trim().toLowerCase()

	return records.filter((record) => {
		const matchesQuery =
			normalizedQuery.length === 0 ||
			record.author.toLowerCase().includes(normalizedQuery) ||
			record.content.toLowerCase().includes(normalizedQuery)

		const matchesStatus = status === "all" || record.status === status

		return matchesQuery && matchesStatus
	})
}
