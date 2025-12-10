import type { ReactNode } from "react"

interface PageLayoutProps {
	children: ReactNode
	/** Maximum width variant */
	maxWidth?: "4xl" | "6xl" | "7xl"
	/** Vertical padding size */
	paddingY?: "8" | "12"
	/** Additional className for the outer container */
	className?: string
}

const MAX_WIDTH_CLASSES = {
	"4xl": "max-w-4xl",
	"6xl": "max-w-6xl",
	"7xl": "max-w-7xl"
} as const

/**
 * Standard page layout wrapper.
 * Provides consistent page structure across all pages.
 */
export function PageLayout({
	children,
	maxWidth = "7xl",
	paddingY = "8",
	className = ""
}: PageLayoutProps) {
	return (
		<div className={`min-h-screen bg-black text-white ${className}`}>
			<div
				className={`${MAX_WIDTH_CLASSES[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-${paddingY}`}
			>
				{children}
			</div>
		</div>
	)
}

interface ContentContainerProps {
	children: ReactNode
	/** Maximum width variant */
	maxWidth?: "4xl" | "6xl" | "7xl"
	/** Additional className */
	className?: string
}

/**
 * Content container for use within sections or when you need
 * just the container without the page wrapper.
 */
export function ContentContainer({
	children,
	maxWidth = "7xl",
	className = ""
}: ContentContainerProps) {
	return (
		<div
			className={`${MAX_WIDTH_CLASSES[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
		>
			{children}
		</div>
	)
}
