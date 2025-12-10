interface PageHeaderProps {
	/** Text before the gradient highlight */
	title: string
	/** Gradient-highlighted text */
	highlight: string
	/** Optional text after the highlight */
	titleSuffix?: string
	/** Description paragraph */
	description: string
	/** Max width for description (tailwind class suffix) */
	descriptionMaxWidth?: "xl" | "2xl" | "3xl" | "4xl"
	/** Additional className for the container */
	className?: string
}

/**
 * Consistent page/section header with gradient text styling.
 * Use this for hero sections and feature section headings.
 */
export function PageHeader({
	title,
	highlight,
	titleSuffix,
	description,
	descriptionMaxWidth = "3xl",
	className = ""
}: PageHeaderProps) {
	return (
		<div className={`text-center mb-12 ${className}`}>
			<h1 className="text-4xl md:text-5xl font-bold mb-6">
				{title}
				<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					{" "}
					{highlight}
				</span>
				{titleSuffix}
			</h1>
			<p
				className={`text-xl text-gray-300 max-w-${descriptionMaxWidth} mx-auto leading-relaxed`}
			>
				{description}
			</p>
		</div>
	)
}

interface SectionHeaderProps {
	/** Text before the gradient highlight */
	title: string
	/** Gradient-highlighted text */
	highlight: string
	/** Optional text after the highlight */
	titleSuffix?: string
	/** Description paragraph */
	description: string
	/** Additional className for the container */
	className?: string
}

/**
 * Section header variant with larger bottom margin.
 * Use this for feature sections within a page.
 */
export function SectionHeader({
	title,
	highlight,
	titleSuffix,
	description,
	className = ""
}: SectionHeaderProps) {
	return (
		<div className={`text-center mb-16 ${className}`}>
			<h2 className="text-4xl md:text-5xl font-bold mb-6">
				{title}
				<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					{" "}
					{highlight}
				</span>
				{titleSuffix && ` ${titleSuffix}`}
			</h2>
			<p className="text-xl text-gray-300 max-w-3xl mx-auto">{description}</p>
		</div>
	)
}
