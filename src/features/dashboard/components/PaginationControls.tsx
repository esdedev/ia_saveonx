import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
	label: string
	pageNumbers: number[]
	currentPage: number
	onPageChange?: (page: number) => void
	hasPrevious?: boolean
	hasNext?: boolean
}

export function PaginationControls({
	label,
	pageNumbers,
	currentPage,
	onPageChange,
	hasPrevious = false,
	hasNext = false
}: PaginationControlsProps) {
	return (
		<div className="flex items-center justify-between mt-6">
			<div className="text-sm text-gray-400">{label}</div>
			<div className="flex items-center space-x-2">
				<Button
					variant="outline"
					size="sm"
					className="border-gray-600 text-gray-300"
					onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
					disabled={!hasPrevious}
				>
					Previous
				</Button>
				{pageNumbers.map((page) => (
					<Button
						key={page}
						variant="outline"
						size="sm"
						className={
							page === currentPage
								? "bg-blue-500 border-blue-500 text-white"
								: "border-gray-600 text-gray-300"
						}
						onClick={() => onPageChange?.(page)}
					>
						{page}
					</Button>
				))}
				<Button
					variant="outline"
					size="sm"
					className="border-gray-600 text-gray-300"
					onClick={() => onPageChange?.(currentPage + 1)}
					disabled={!hasNext}
				>
					Next
				</Button>
			</div>
		</div>
	)
}
